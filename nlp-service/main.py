from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import mimetypes
import fitz  # PyMuPDF
import docx2txt
import tempfile
import re

app = FastAPI()

def extract_text_from_pdf(file_path):
    text = ""
    links = set()
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
            # Extract embedded links (annotations)
            for link in page.get_links():
                uri = link.get('uri')
                if uri:
                    links.add(uri)
    # Also extract visible links from text
    links.update(re.findall(r'(https?://[^\s,;]+)', text))
    return text, list(links)

def extract_text_from_docx(file_path):
    text = docx2txt.process(file_path)
    # Extract links from text
    links = re.findall(r'(https?://[^\s,;]+)', text)
    # Also try to match www. and bare domain links
    links += re.findall(r'(www\.[^\s,;]+)', text)
    return text, list(set(links))

@app.get("/health")
def health():
    return JSONResponse(content={"status": "ok"})

@app.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    suffix = mimetypes.guess_extension(file.content_type)
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    if file.content_type == "application/pdf":
        text, links = extract_text_from_pdf(tmp_path)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text, links = extract_text_from_docx(tmp_path)
    else:
        return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    return {
        "raw_text": text,
        "links": links,
        "file_type": file.content_type
    } 