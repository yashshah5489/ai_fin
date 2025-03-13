"""
API routes for document analysis using AI.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..schemas.schemas import AnalysisRequest, AnalysisResponse
from ..models.models import Document, User
from ..database.database import get_db
from ..utils.langchain_utils import analyze_financial_document

# Create router
router = APIRouter()

@router.post("/investment", response_model=AnalysisResponse)
async def analyze_investment_document(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze an investment document using LangChain AI.
    """
    return await analyze_document(request, "investment", db)

@router.post("/forecast", response_model=AnalysisResponse)
async def analyze_forecast_document(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze a financial forecast document using LangChain AI.
    """
    return await analyze_document(request, "forecast", db)

@router.post("/risk", response_model=AnalysisResponse)
async def analyze_risk_document(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze a risk assessment document using LangChain AI.
    """
    return await analyze_document(request, "risk", db)

async def analyze_document(request: AnalysisRequest, analysis_type: str, db: Session) -> Dict[str, Any]:
    """
    Common function to analyze documents.
    """
    # Check if document exists
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check if user exists and has access to the document
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if document.user_id != request.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have access to this document"
        )
    
    # Check if document has content
    if not document.content_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has no content to analyze"
        )
    
    try:
        # Extract text content from the document
        from ..utils.pdf_utils import extract_pdf_content
        extracted_content = extract_pdf_content(document.content_base64)
        document_text = extracted_content["text"]
        
        # Analyze document
        analysis_result = await analyze_financial_document(document_text, analysis_type)
        
        # Update document with analysis
        document.analysis = analysis_result
        db.commit()
        
        return {
            "success": True,
            "analysis": analysis_result
        }
    
    except Exception as e:
        # Log error and return failure
        error_message = str(e)
        return {
            "success": False,
            "analysis": None,
            "error": error_message
        }