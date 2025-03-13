"""
API routes for financial data management.
All financial data is in INR currency.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from ..schemas.schemas import FinancialDataCreate, FinancialDataResponse, FinancialDataUpdate, FinancialSummary
from ..models.models import FinancialData, User
from ..database.database import get_db

# Create router
router = APIRouter()

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
    
    # Create database record
    db_data = FinancialData(
        category=data.category,
        type=data.type,
        amount=data.amount,
        description=data.description,
        recurring=data.recurring,
        frequency=data.frequency,
        date=data.date,
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
    
    # Query financial data
    query = db.query(FinancialData).filter(FinancialData.user_id == user_id)
    
    if category:
        query = query.filter(FinancialData.category == category)
    
    if type:
        query = query.filter(FinancialData.type == type)
    
    return query.all()

@router.get("/{data_id}", response_model=FinancialDataResponse)
def get_financial_data(data_id: int, db: Session = Depends(get_db)):
    """
    Get a specific financial data entry by ID.
    """
    db_data = db.query(FinancialData).filter(FinancialData.id == data_id).first()
    if not db_data:
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
    if not db_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial data not found"
        )
    
    # Update fields if provided
    for key, value in data_update.dict(exclude_unset=True).items():
        setattr(db_data, key, value)
    
    db.commit()
    db.refresh(db_data)
    
    return db_data

@router.delete("/{data_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_financial_data(data_id: int, db: Session = Depends(get_db)):
    """
    Delete a financial data entry.
    """
    db_data = db.query(FinancialData).filter(FinancialData.id == data_id).first()
    if not db_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial data not found"
        )
    
    db.delete(db_data)
    db.commit()
    
    return None

@router.get("/summary/{user_id}", response_model=FinancialSummary)
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
    
    # Get all financial data for the user
    financial_data = db.query(FinancialData).filter(FinancialData.user_id == user_id).all()
    
    # Initialize summaries
    total_income = 0.0
    total_expenses = 0.0
    total_investments = 0.0
    total_assets = 0.0
    total_liabilities = 0.0
    income_breakdown = {}
    expense_breakdown = {}
    investment_allocation = {}
    
    # Calculate monthly numbers (for last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    monthly_income = 0.0
    monthly_expenses = 0.0
    
    # Process financial data
    for data in financial_data:
        # Handle data based on category
        if data.category == "income":
            total_income += data.amount
            
            # Add to income breakdown
            if data.type in income_breakdown:
                income_breakdown[data.type] += data.amount
            else:
                income_breakdown[data.type] = data.amount
                
            # Add to monthly income if within last 30 days
            if data.date >= thirty_days_ago:
                monthly_income += data.amount
                
        elif data.category == "expense":
            total_expenses += data.amount
            
            # Add to expense breakdown
            if data.type in expense_breakdown:
                expense_breakdown[data.type] += data.amount
            else:
                expense_breakdown[data.type] = data.amount
                
            # Add to monthly expenses if within last 30 days
            if data.date >= thirty_days_ago:
                monthly_expenses += data.amount
                
        elif data.category == "investment":
            total_investments += data.amount
            
            # Add to investment allocation
            if data.type in investment_allocation:
                investment_allocation[data.type] += data.amount
            else:
                investment_allocation[data.type] = data.amount
                
        elif data.category == "asset":
            total_assets += data.amount
            
        elif data.category == "liability":
            total_liabilities += data.amount
    
    # Calculate monthly savings
    monthly_savings = monthly_income - monthly_expenses
    
    # Calculate yearly savings (estimated)
    yearly_savings = monthly_savings * 12
    
    # Calculate net worth
    net_worth = total_assets - total_liabilities
    
    # Determine emergency fund status
    monthly_expenses_average = monthly_expenses
    if monthly_expenses_average > 0:
        emergency_fund_ratio = total_assets / monthly_expenses_average
        if emergency_fund_ratio >= 6:
            emergency_fund_status = "Excellent"
        elif emergency_fund_ratio >= 3:
            emergency_fund_status = "Good"
        elif emergency_fund_ratio >= 1:
            emergency_fund_status = "Needs improvement"
        else:
            emergency_fund_status = "Critical"
    else:
        emergency_fund_status = "Unknown"
    
    # Estimate tax based on Indian tax slabs (simplified)
    # This is a simplified calculation for illustrative purposes
    # In a real app, this would be much more complex
    if total_income <= 250000:  # Up to 2.5 lakhs
        tax_estimate = 0
    elif total_income <= 500000:  # 2.5 to 5 lakhs
        tax_estimate = (total_income - 250000) * 0.05
    elif total_income <= 750000:  # 5 to 7.5 lakhs
        tax_estimate = 12500 + (total_income - 500000) * 0.10
    elif total_income <= 1000000:  # 7.5 to 10 lakhs
        tax_estimate = 37500 + (total_income - 750000) * 0.15
    elif total_income <= 1250000:  # 10 to 12.5 lakhs
        tax_estimate = 75000 + (total_income - 1000000) * 0.20
    elif total_income <= 1500000:  # 12.5 to 15 lakhs
        tax_estimate = 125000 + (total_income - 1250000) * 0.25
    else:  # Above 15 lakhs
        tax_estimate = 187500 + (total_income - 1500000) * 0.30
    
    # Estimate standard Indian investment contributions
    # These are simplified calculations
    ppf_contribution = min(total_income * 0.1, 150000)  # 10% of income up to 1.5 lakhs
    epf_contribution = total_income * 0.12  # 12% of salary
    nps_contribution = total_income * 0.1  # 10% of salary
    insurance_premium = total_income * 0.05  # 5% of income
    
    return FinancialSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        total_investments=total_investments,
        total_assets=total_assets,
        total_liabilities=total_liabilities,
        net_worth=net_worth,
        monthly_savings=monthly_savings,
        yearly_savings=yearly_savings,
        emergency_fund_status=emergency_fund_status,
        investment_allocation=investment_allocation,
        expense_breakdown=expense_breakdown,
        income_breakdown=income_breakdown,
        tax_estimate=tax_estimate,
        ppf_contribution=ppf_contribution,
        epf_contribution=epf_contribution,
        nps_contribution=nps_contribution,
        insurance_premium=insurance_premium
    )