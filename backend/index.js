import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import mongoose from "mongoose";
import { MongoClient, GridFSBucket } from "mongodb";
import crypto from "crypto";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // adjust as needed
    credentials: true,
  })
);

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

mongoose.connect(process.env.MONGO_URI);

const resumeSchema = new mongoose.Schema(
  {
    raw_text: String,
    links: [String],
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    uploadDate: Date,
    hash: String,
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000";

app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or invalid file type" });
  }

  let fileId = null;
  let fileHash = null;
  let deduplicated = false;
  try {
    // Compute SHA-256 hash of the file
    const hash = crypto.createHash("sha256");
    const fileBuffer = fs.readFileSync(req.file.path);
    hash.update(fileBuffer);
    fileHash = hash.digest("hex");

    // Reuse shared MongoClient and GridFS
    const client = await getSharedMongoClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Check for existing file with the same hash
    const existing = await bucket.find({ "metadata.hash": fileHash }).toArray();
    if (existing.length > 0) {
      // File already exists, use its fileId
      fileId = existing[0]._id;
      deduplicated = true;
    } else {
      // Store file in GridFS with hash as metadata
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { hash: fileHash },
      });
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(uploadStream)
          .on("error", (error) => {
            reject(error);
          })
          .on("finish", () => {
            fileId = uploadStream.id;
            resolve();
          });
      });
    }

    // Prepare form data for FastAPI
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

    // Send to FastAPI /parse endpoint
    const response = await axios.post(`${NLP_SERVICE_URL}/parse`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Save parsed data and fileId to resumes collection
    const resumeDoc = new Resume({
      raw_text: response.data.raw_text,
      links: response.data.links,
      fileId: fileId,
      filename: req.file.originalname,
      uploadDate: new Date(),
      hash: fileHash,
    });
    await resumeDoc.save();

    // Optionally, delete the file after forwarding
    fs.unlink(req.file.path, () => {});

    // Return parsed data and fileId to frontend
    return res.json({
      raw_text: response.data.raw_text,
      links: response.data.links
    });
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: "Failed to parse or store resume", details: err.message });
  }
});

// Simple API endpoint for frontend testing
app.post('/api/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Dummy parsed result for frontend integration
  res.json({
    raw_text: 'Sample parsed resume text',
    links: ['https://example.com']
  });
});

// MongoDB connection pooling for GridFS
const sharedMongoClient = new MongoClient(process.env.MONGO_URI);
let sharedMongoClientPromise = null;
async function getSharedMongoClient() {
  if (!sharedMongoClientPromise) {
    sharedMongoClientPromise = sharedMongoClient.connect();
  }
  await sharedMongoClientPromise;
  return sharedMongoClient;
}

app.post("/resume", async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.json({ message: "Resume saved successfully", resume });
  } catch (err) {
    res.status(500).json({ error: "Failed to save resume", details: err.message });
  }
});

app.get("/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes", details: err.message });
  }
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, ADMIN_JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Middleware to protect admin routes
function requireAdminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid token' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Protect admin data endpoints
app.get('/api/admin/resumes', requireAdminAuth, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes', details: err.message });
  }
});

// Admin: Get all files in GridFS
app.get('/api/admin/files', requireAdminAuth, async (req, res) => {
  try {
    const client = await getSharedMongoClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);
    const files = await bucket.find().sort({ uploadDate: -1 }).toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files', details: err.message });
  }
});

// Admin: Download original file by ID
app.get('/api/admin/files/:id/download', requireAdminAuth, async (req, res) => {
  try {
    const client = await getSharedMongoClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);
    const fileId = new ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).json({ error: 'File not found' });
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=\"${files[0].filename}\"`);
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download file', details: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 