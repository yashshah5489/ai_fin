from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Financial Advisor API",
    description="India-specific financial analysis application with AI capabilities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from .api.users import router as users_router
from .api.documents import router as documents_router
from .api.chat import router as chat_router
from .api.financial_data import router as financial_data_router
from .api.news import router as news_router
from .api.analysis import router as analysis_router

app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(financial_data_router, prefix="/api/financial", tags=["financial"])
app.include_router(news_router, prefix="/api/news", tags=["news"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])

@app.get("/", tags=["root"])
async def root():
    """Root endpoint to verify the API is running."""
    return {"message": "Financial Advisor API is running", "status": "online"}