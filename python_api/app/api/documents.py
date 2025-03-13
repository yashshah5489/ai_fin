from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import base64
import os
import shutil
from datetime import datetime
import pytz

from ..database.database import get_db
from ..models.models import Document, User
from ..schemas.schemas import DocumentCreate, DocumentResponse, DocumentUpdate
from ..utils.pdf_utils import extract_pdf_content, get_pdf_data_url

router = APIRouter()

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    title: str = Form(...),
    category: str = Form(...),
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a new document and associate it with a user.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate file type (currently only supporting PDF)
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".pdf"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Generate a unique filename
    timestamp = datetime.now(IST).strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file to disk
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Convert to base64 for storage in database
    content_base64 = base64.b64encode(file_content).decode()
    
    # Create document record
    db_document = Document(
        title=title,
        category=category,
        file_type="pdf",
        file_path=file_path,
        content_base64=content_base64,
        user_id=user_id
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """
    Get a specific document by ID.
    """
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return db_document

@router.get("/user/{user_id}", response_model=List[DocumentResponse])
def get_user_documents(
    user_id: int, 
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all documents for a specific user, optionally filtered by category.
    """
    query = db.query(Document).filter(Document.user_id == user_id)
    
    if category:
        query = query.filter(Document.category == category)
    
    documents = query.all()
    return documents

@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a document's metadata or analysis.
    """
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Update document fields
    if document_update.title is not None:
        db_document.title = document_update.title
        
    if document_update.category is not None:
        db_document.category = document_update.category
        
    if document_update.analysis is not None:
        db_document.analysis = document_update.analysis.dict()
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """
    Delete a document.
    """
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete physical file if it exists
    if db_document.file_path and os.path.exists(db_document.file_path):
        os.remove(db_document.file_path)
    
    # Delete database record
    db.delete(db_document)
    db.commit()
    
    return None

@router.get("/{document_id}/content")
def get_document_content(document_id: int, db: Session = Depends(get_db)):
    """
    Extract and return the content of a document.
    """
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if not db_document.content_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has no content"
        )
    
    try:
        # Extract content using pypdf
        content = extract_pdf_content(db_document.content_base64)
        return JSONResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting document content: {str(e)}"
        )

@router.get("/{document_id}/data-url")
def get_document_data_url(document_id: int, db: Session = Depends(get_db)):
    """
    Get a data URL for displaying the document.
    """
    db_document = db.query(Document).filter(Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if not db_document.content_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has no content"
        )
    
    try:
        data_url = get_pdf_data_url(db_document.content_base64)
        return {"data_url": data_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating data URL: {str(e)}"
        )