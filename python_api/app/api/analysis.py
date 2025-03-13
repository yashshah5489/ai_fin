from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..database.database import get_db
from ..models.models import Document, User
from ..schemas.schemas import AnalysisRequest, AnalysisResponse, DocumentAnalysis
from ..utils.langchain_utils import analyze_financial_document
from ..utils.pdf_utils import extract_pdf_content

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
    # Check if user exists
    db_user = db.query(User).filter(User.id == request.user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if document exists and belongs to user
    db_document = db.query(Document).filter(
        Document.id == request.document_id,
        Document.user_id == request.user_id
    ).first()
    
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or does not belong to user"
        )
    
    # Extract document content
    if not db_document.content_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has no content"
        )
    
    try:
        # Extract text content from PDF
        pdf_content = extract_pdf_content(db_document.content_base64)
        document_text = pdf_content["text"]
        
        if not document_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from document"
            )
        
        # Analyze document using LangChain
        analysis_result = analyze_financial_document(document_text, analysis_type)
        
        # Update document with analysis results
        db_document.analysis = {
            "summary": analysis_result["summary"],
            "insights": analysis_result["insights"],
            "recommendations": analysis_result["recommendations"]
        }
        
        db.commit()
        
        return {
            "success": True,
            "analysis": DocumentAnalysis(
                summary=analysis_result["summary"],
                insights=analysis_result["insights"],
                recommendations=analysis_result["recommendations"]
            )
        }
    except Exception as e:
        # Log the error
        print(f"Error analyzing document: {str(e)}")
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing document: {str(e)}"
        )