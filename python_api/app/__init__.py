"""
Initialize the Financial Advisor API application.
This module sets up the FastAPI application and includes all routers.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import users, documents, chat, financial_data, news, analysis

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Financial Advisor API",
        description="API for financial analysis and document processing with AI capabilities",
        version="1.0.0",
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
    app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
    app.include_router(financial_data.router, prefix="/api/financial-data", tags=["financial-data"])
    app.include_router(news.router, prefix="/api/news", tags=["news"])
    app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

    @app.get("/", tags=["root"])
    async def root():
        """Root endpoint to verify the API is running."""
        return {
            "message": "Financial Advisor API is running",
            "docs": "/docs",
            "version": "1.0.0",
        }

    return app