from langchain.tools import tool
from pathlib import Path
import fitz  # PyMuPDF

@tool
def extract_pdf_text(pdf_path: str) -> str:
    """
    Extracts raw text from a PDF file using PyMuPDF.
    Provide the full file path to the PDF.
    Returns a string of the combined text content.
    """
    if not Path(pdf_path).exists():
        return f"Error: File not found at {pdf_path}"

    try:
        doc = fitz.open(pdf_path)
        text = "\n\n".join(page.get_text() for page in doc)
        doc.close()
        return text.strip()
    except Exception as e:
        return f"Error parsing PDF: {str(e)}"