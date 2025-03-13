"""
Script to initialize the database for the Financial Advisor API.
Creates all tables and adds initial data if needed.
"""
import os
import sys
from dotenv import load_dotenv

# Add the parent directory to sys.path to import app modules
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))
sys.path.append(parent_dir)

# Import needed modules
from app.database.database import engine, Base
from app.models.models import User, Document, ChatMessage, FinancialData, NewsItem

# Load environment variables
load_dotenv()

def init_db():
    """Initialize the database by creating all tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    print("Initializing database for Financial Advisor API...")
    init_db()
    print("Database initialization complete!")