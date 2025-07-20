# AI Resume Parser

A full-stack MERN application for uploading resumes (PDF/DOCX), extracting raw text and links using AI/NLP, and managing parsed data.

## Technologies Used

- **Frontend:** React.js + Tailwind CSS (UI)
- **Backend:** Node.js + Express.js (API, file upload, MongoDB, GridFS)
- **Database:** MongoDB Atlas (cloud database, file storage with GridFS)
- **NLP Service:** Python FastAPI (resume parsing with spaCy, PyMuPDF, docx2txt)

## Project Structure

- `frontend/` – React app (UI)
- `backend/` – Node.js/Express API (file upload, MongoDB, GridFS)
- `nlp-service/` – Python FastAPI microservice (resume parsing)

## Manual Setup

1. **Clone the repo**
2. **Install dependencies** in each folder:
   - `cd backend && npm install`
   - `cd frontend && npm install`
   - `cd nlp-service && pip install -r requirements.txt`
3. **Set up environment variables**
   - Create `.env` files in `backend/` and `nlp-service/` as needed (see code for required variables, e.g., `MONGO_URI`)
4. **Start each service manually (in separate terminals):**
   - Backend: `cd backend && node index.js`
   - NLP Service: `cd nlp-service && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000` (Windows) or `source venv/bin/activate && uvicorn main:app --reload --port 8000` (Mac/Linux)
   - Frontend: `cd frontend && npm start`

## One-Command Setup (Recommended for Dev)

1. From the project root, install root dependencies:
   ```sh
   npm install
   ```
2. Start all services together:
   ```sh
   npm run dev
   ```
   This will launch backend, frontend, and NLP service concurrently.

## Notes

- Requires MongoDB Atlas (or local MongoDB for dev)
- See code for more details and customization
