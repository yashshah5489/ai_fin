from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz
from ..database.database import Base

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    full_name = Column(String(100))
    password_hash = Column(String(255))
    profile_image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(IST))
    updated_at = Column(DateTime, default=lambda: datetime.now(IST), onupdate=lambda: datetime.now(IST))
    preferences = Column(JSON, nullable=True)  # Store user preferences as JSON

    # Relationships
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    financial_data = relationship("FinancialData", back_populates="user", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    category = Column(String(50))  # investment, forecast, risk, etc.
    file_type = Column(String(10))  # pdf, csv, etc.
    file_path = Column(String(255))
    content_base64 = Column(Text, nullable=True)  # For storing small files directly
    upload_date = Column(DateTime, default=lambda: datetime.now(IST))
    user_id = Column(Integer, ForeignKey("users.id"))
    analysis = Column(JSON, nullable=True)  # Store analysis results as JSON

    # Relationships
    user = relationship("User", back_populates="documents")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text)
    is_user = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST))
    related_to = Column(String(100), nullable=True)  # Category the message relates to
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="chat_messages")

class FinancialData(Base):
    __tablename__ = "financial_data"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=lambda: datetime.now(IST))
    category = Column(String(50))  # income, expense, investment, asset, liability
    type = Column(String(50))  # salary, dividend, groceries, etc.
    amount = Column(Float)  # In INR
    description = Column(String(255), nullable=True)
    recurring = Column(Boolean, default=False)
    frequency = Column(String(20), nullable=True)  # monthly, quarterly, etc.
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="financial_data")

class NewsItem(Base):
    __tablename__ = "news_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    content = Column(Text)
    source = Column(String(100))
    url = Column(String(255))
    publish_date = Column(DateTime)
    category = Column(String(50), nullable=True)  # finance, markets, economy, etc.
    created_at = Column(DateTime, default=lambda: datetime.now(IST))