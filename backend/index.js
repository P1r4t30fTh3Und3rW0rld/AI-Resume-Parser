require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB Atlas using .env
mongoose.connect(process.env.MONGO_URI);

const resumeSchema = new mongoose.Schema({
  raw_text: String,
  links: [String],
  fileId: mongoose.Schema.Types.ObjectId,
  filename: String,
  uploadDate: Date
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }

  let fileId = null;
  try {
    // Prepare form data for FastAPI
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    // Send to FastAPI /parse endpoint
    const response = await axios.post('http://localhost:8000/parse', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Store file in GridFS
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db);
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(uploadStream)
        .on('error', (error) => {
          client.close();
          reject(error);
        })
        .on('finish', () => {
          fileId = uploadStream.id;
          client.close();
          resolve();
        });
    });

    // Save parsed data and fileId to resumes collection
    const resumeDoc = new Resume({
      raw_text: response.data.raw_text,
      links: response.data.links,
      fileId: fileId,
      filename: req.file.originalname,
      uploadDate: new Date()
    });
    await resumeDoc.save();

    // Optionally, delete the file after forwarding
    fs.unlink(req.file.path, () => {});

    // Return parsed data and fileId to frontend
    return res.json({
      message: 'File uploaded and parsed successfully',
      parsed: response.data,
      fileId: fileId,
      resumeId: resumeDoc._id
    });
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: 'Failed to parse or store resume', details: err.message });
  }
});

app.post('/resume', async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.json({ message: 'Resume saved successfully', resume });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save resume', details: err.message });
  }
});

app.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 