"""
Utility functions for working with PDF files.
"""
import base64
from io import BytesIO
import pypdf
from typing import Dict, Any


def base64_to_bytes(base64_string: str) -> bytes:
    """Convert a base64 string to bytes."""
    try:
        return base64.b64decode(base64_string)
    except Exception as e:
        raise ValueError(f"Invalid base64 string: {str(e)}")


def extract_pdf_content(base64_content: str) -> Dict[str, Any]:
    """
    Extract text and metadata from a PDF file encoded as base64.
    
    Args:
        base64_content (str): The PDF content encoded as base64
        
    Returns:
        Dict containing extracted text, page count and metadata
    """
    try:
        # Convert base64 to bytes
        pdf_bytes = base64_to_bytes(base64_content)
        
        # Create a PDF reader
        pdf_file = BytesIO(pdf_bytes)
        pdf_reader = pypdf.PdfReader(pdf_file)
        
        # Extract text from each page
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n\n"
        
        # Get metadata
        metadata = pdf_reader.metadata
        info = {}
        
        if metadata:
            # Extract common metadata fields
            if metadata.title:
                info["title"] = metadata.title
            if metadata.author:
                info["author"] = metadata.author
            if metadata.subject:
                info["subject"] = metadata.subject
            if metadata.creator:
                info["creator"] = metadata.creator
            if metadata.producer:
                info["producer"] = metadata.producer
            if metadata.creation_date:
                info["creation_date"] = str(metadata.creation_date)
        
        # Return extracted data
        return {
            "text": text,
            "page_count": len(pdf_reader.pages),
            "metadata": info
        }
    
    except Exception as e:
        raise Exception(f"Error extracting PDF content: {str(e)}")


def get_pdf_data_url(content_base64: str) -> str:
    """
    Get a data URL for a PDF file encoded as base64.
    
    Args:
        content_base64 (str): The PDF content encoded as base64
        
    Returns:
        str: Data URL for the PDF
    """
    try:
        # Ensure we have clean base64 content
        if "," in content_base64:
            content_base64 = content_base64.split(",")[1]
        
        # Create data URL
        data_url = f"data:application/pdf;base64,{content_base64}"
        
        return data_url
    
    except Exception as e:
        raise Exception(f"Error creating PDF data URL: {str(e)}")