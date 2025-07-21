# AI Resume Parser

A full-stack AI-powered resume parser with modern authentication, file upload, and admin dashboard.

## Overview

AI Resume Parser is designed to help users quickly extract all the raw text and links from their resumes. It uses a Python NLP microservice for robust parsing, stores original files in MongoDB (GridFS), and provides a clean, minimal React dashboard for managing and downloading results.

## Technologies Used

- **Frontend:**
  - React 19 (functional components, hooks)
  - Tailwind CSS (utility-first styling)
  - Supabase Auth (user authentication)
  - React Hot Toast (notifications)
  - Headless UI (accessible UI components)
  - Framer Motion (animations)
  - React Router DOM (routing)
  - React Icons (iconography)
- **Backend:**
  - Node.js + Express.js (REST API)
  - MongoDB Atlas (cloud database)
  - GridFS (file storage)
  - Multer (file uploads)
  - JWT (admin authentication)
  - CORS, dotenv, bcryptjs (security and config)
- **NLP Service:**
  - Python FastAPI (microservice)
  - spaCy (NLP)
  - PyMuPDF (PDF parsing)
  - docx2txt (DOCX parsing)
  - python-multipart (file upload handling)
- **Features:**
  - Modern glassmorphism UI (cribble.dev inspired)
  - Email verification and secure login/signup
  - Admin dashboard with file management, modals, and copy/download
  - Responsive, accessible, and animated user experience

## Project Structure

```
frontend/    # React app (UI)
backend/     # Node.js/Express API, MongoDB, GridFS
nlp-service/ # Python FastAPI microservice (resume parsing)
```

## One-Command Setup (Recommended for Dev)

1. **Clone the repo**
2. **Install all dependencies and set up node_modules:**
   ```sh
   npm run predev
   ```
3. **Set up the Python virtual environment for NLP service:**
   ```sh
   cd nlp-service
   python -m venv venv
   venv\Scripts\pip install -r requirements.txt
   cd ..
   ```
4. **Start all services together:**
   ```sh
   npm run dev
   ```
   This will launch backend, frontend, and NLP service concurrently.

## Manual Setup (Advanced/Alternative)

1. **Install dependencies in each folder:**
   ```sh
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   cd nlp-service && pip install -r requirements.txt && cd ..
   ```
2. **Set up environment variables:**
   - Create `.env` files in `backend/` and `nlp-service/` as needed (see code for required variables, e.g., `MONGO_URI`)
3. **Start each service manually (in separate terminals):**
   - Backend: `cd backend && node index.js`
   - NLP Service: `cd nlp-service && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000` (Windows) or `source venv/bin/activate && uvicorn main:app --reload --port 8000` (Mac/Linux)
   - Frontend: `cd frontend && npm start`

## Usage

- Open the frontend in your browser (usually at http://localhost:3000)
- Upload a PDF or DOCX resume
- View the extracted raw text and links
- Download the parsed data as JSON

## Notes

- Requires MongoDB Atlas (or local MongoDB for dev)
- See code for more details and customization
