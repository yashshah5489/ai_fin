from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import pytz

from ..database.database import get_db
from ..models.models import FinancialData, User
from ..schemas.schemas import FinancialDataCreate, FinancialDataResponse, FinancialDataUpdate

router = APIRouter()

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

@router.post("/", response_model=FinancialDataResponse, status_code=status.HTTP_201_CREATED)
def create_financial_data(data: FinancialDataCreate, db: Session = Depends(get_db)):
    """
    Create a new financial data entry.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == data.user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create financial data entry
    db_data = FinancialData(
        category=data.category,
        type=data.type,
        amount=data.amount,
        description=data.description,
        recurring=data.recurring,
        frequency=data.frequency,
        date=data.date or datetime.now(IST),
        user_id=data.user_id
    )
    
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    
    return db_data

@router.get("/user/{user_id}", response_model=List[FinancialDataResponse])
def get_user_financial_data(
    user_id: int, 
    category: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get financial data for a specific user, optionally filtered by category and/or type.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build query
    query = db.query(FinancialData).filter(FinancialData.user_id == user_id)
    
    if category:
        query = query.filter(FinancialData.category == category)
    
    if type:
        query = query.filter(FinancialData.type == type)
    
    # Get financial data sorted by date (most recent first)
    financial_data = query.order_by(FinancialData.date.desc()).all()
    
    return financial_data

@router.get("/{data_id}", response_model=FinancialDataResponse)
def get_financial_data(data_id: int, db: Session = Depends(get_db)):
    """
    Get a specific financial data entry by ID.
    """
    db_data = db.query(FinancialData).filter(FinancialData.id == data_id).first()
    if db_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial data not found"
        )
    
    return db_data

@router.put("/{data_id}", response_model=FinancialDataResponse)
def update_financial_data(
    data_id: int,
    data_update: FinancialDataUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a financial data entry.
    """
    db_data = db.query(FinancialData).filter(FinancialData.id == data_id).first()
    if db_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial data not found"
        )
    
    # Update fields if provided
    if data_update.category is not None:
        db_data.category = data_update.category
    
    if data_update.type is not None:
        db_data.type = data_update.type
    
    if data_update.amount is not None:
        db_data.amount = data_update.amount
    
    if data_update.description is not None:
        db_data.description = data_update.description
    
    if data_update.recurring is not None:
        db_data.recurring = data_update.recurring
    
    if data_update.frequency is not None:
        db_data.frequency = data_update.frequency
    
    if data_update.date is not None:
        db_data.date = data_update.date
    
    db.commit()
    db.refresh(db_data)
    
    return db_data

@router.delete("/{data_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_financial_data(data_id: int, db: Session = Depends(get_db)):
    """
    Delete a financial data entry.
    """
    db_data = db.query(FinancialData).filter(FinancialData.id == data_id).first()
    if db_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial data not found"
        )
    
    db.delete(db_data)
    db.commit()
    
    return None

@router.get("/summary/{user_id}")
def get_financial_summary(user_id: int, db: Session = Depends(get_db)):
    """
    Get a summary of financial data for a user (income, expenses, investments, assets, liabilities).
    All values are in INR.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get all financial data for user
    financial_data = db.query(FinancialData).filter(FinancialData.user_id == user_id).all()
    
    # Calculate totals by category
    income_total = sum(data.amount for data in financial_data if data.category == "income")
    expense_total = sum(data.amount for data in financial_data if data.category == "expense")
    investment_total = sum(data.amount for data in financial_data if data.category == "investment")
    asset_total = sum(data.amount for data in financial_data if data.category == "asset")
    liability_total = sum(data.amount for data in financial_data if data.category == "liability")
    
    # Calculate net worth and savings
    net_worth = asset_total - liability_total
    savings = income_total - expense_total
    
    return {
        "income_total": income_total,
        "expense_total": expense_total,
        "investment_total": investment_total,
        "asset_total": asset_total,
        "liability_total": liability_total,
        "net_worth": net_worth,
        "savings": savings,
        "currency": "INR"
    }