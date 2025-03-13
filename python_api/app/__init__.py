"""
Initialize the Financial Advisor API application.
This module sets up the FastAPI application and includes all routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .api import users, documents, chat, financial_data, news, analysis
from .database.database import engine, Base

# Initialize the FastAPI application
app = FastAPI(
    title="Financial Advisor API",
    description="""
    An India-specific financial analysis application with AI-powered insights,
    PDF processing capabilities, and multiple specialized modules.
    All financial data is handled in INR currency.
    """,
    version="0.1.0",
)

# Set up CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint to verify the API is running."""
    return {
        "message": "Welcome to the Financial Advisor API",
        "version": "0.1.0",
        "status": "active"
    }

# Include all routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(financial_data.router, prefix="/api/financial", tags=["financial data"])
app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])