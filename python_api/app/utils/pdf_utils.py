import base64
import io
from typing import Dict, Any, Optional
from pypdf import PdfReader

def base64_to_bytes(base64_string: str) -> bytes:
    """Convert a base64 string to bytes."""
    # Remove potential data URL prefix
    if ',' in base64_string:
        base64_string = base64_string.split(',', 1)[1]
    return base64.b64decode(base64_string)

def extract_pdf_content(base64_content: str) -> Dict[str, Any]:
    """
    Extract text and metadata from a PDF file encoded as base64.
    
    Args:
        base64_content (str): The PDF content encoded as base64
        
    Returns:
        Dict containing extracted text, page count and metadata
    """
    pdf_bytes = base64_to_bytes(base64_content)
    pdf_file = io.BytesIO(pdf_bytes)
    
    try:
        reader = PdfReader(pdf_file)
        text = ""
        
        # Extract text from all pages
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
        
        # Get metadata
        info = reader.metadata
        
        return {
            "text": text,
            "page_count": len(reader.pages),
            "title": info.title if info and info.title else None,
            "author": info.author if info and info.author else None,
            "creation_date": info.creation_date if info and info.creation_date else None,
        }
    except Exception as e:
        raise Exception(f"Failed to extract PDF content: {str(e)}")

def get_pdf_data_url(content_base64: str) -> str:
    """
    Get a data URL for a PDF file encoded as base64.
    
    Args:
        content_base64 (str): The PDF content encoded as base64
        
    Returns:
        str: Data URL for the PDF
    """
    # Check if it's already a data URL
    if content_base64.startswith('data:application/pdf;base64,'):
        return content_base64
    else:
        return f'data:application/pdf;base64,{content_base64}'