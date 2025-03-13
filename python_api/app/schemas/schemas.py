from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
import pytz

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    profile_image: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserPreferences(BaseModel):
    theme: Optional[str] = "light"
    currency: str = "INR"
    notifications: bool = True
    language: str = "en"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    preferences: Optional[UserPreferences] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    preferences: Optional[UserPreferences] = None
    
    class Config:
        orm_mode = True

# Document Schemas
class DocumentBase(BaseModel):
    title: str
    category: str
    file_type: str

class DocumentCreate(DocumentBase):
    content_base64: Optional[str] = None
    user_id: int

class DocumentAnalysis(BaseModel):
    summary: str
    insights: List[str]
    recommendations: List[str]

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    analysis: Optional[DocumentAnalysis] = None

class DocumentResponse(DocumentBase):
    id: int
    upload_date: datetime
    file_path: Optional[str] = None
    user_id: int
    analysis: Optional[DocumentAnalysis] = None
    
    class Config:
        orm_mode = True

# Chat Schemas
class ChatMessageBase(BaseModel):
    message: str
    is_user: bool = True
    related_to: Optional[str] = None

class ChatMessageCreate(ChatMessageBase):
    user_id: int

class ChatMessageResponse(ChatMessageBase):
    id: int
    timestamp: datetime
    user_id: int
    
    class Config:
        orm_mode = True

# Financial Data Schemas
class FinancialDataBase(BaseModel):
    category: str
    type: str
    amount: float
    description: Optional[str] = None
    recurring: Optional[bool] = False
    frequency: Optional[str] = None
    date: Optional[datetime] = None

class FinancialDataCreate(FinancialDataBase):
    user_id: int

class FinancialDataUpdate(BaseModel):
    category: Optional[str] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    recurring: Optional[bool] = None
    frequency: Optional[str] = None
    date: Optional[datetime] = None

class FinancialDataResponse(FinancialDataBase):
    id: int
    user_id: int
    date: datetime
    
    class Config:
        orm_mode = True

# News Schemas
class NewsItemBase(BaseModel):
    title: str
    content: str
    source: str
    url: str
    publish_date: datetime
    category: Optional[str] = None

class NewsItemCreate(NewsItemBase):
    pass

class NewsItemResponse(NewsItemBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Search Schemas
class NewsSearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 5

# Analysis Schemas
class AnalysisRequest(BaseModel):
    document_id: int
    user_id: int

class AnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[DocumentAnalysis] = None