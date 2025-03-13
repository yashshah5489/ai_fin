"""
Setup script for the Financial Advisor API.
This is not a package installer, but a helper script to set up the development environment.
"""

import os
import sys
import subprocess
import argparse

def setup_environment():
    """Set up the development environment."""
    print("Setting up development environment for Financial Advisor API")
    
    # Create .env file if it doesn't exist
    if not os.path.exists(".env"):
        print("\nCreating .env file...")
        with open(".env", "w") as env_file:
            env_file.write("""# Financial Advisor API Environment Variables
DATABASE_URL=sqlite:///./financial_advisor.db
DEBUG=True
SECRET_KEY=yoursecretkeyhere
# Uncomment and add your API keys below
# OPENAI_API_KEY=your_openai_api_key_here
# TAVILY_API_KEY=your_tavily_api_key_here
""")
        print("Created .env file. Please edit it to add your API keys.")
    else:
        print(".env file already exists. Skipping creation.")
    
    # Create database directory if it doesn't exist
    if not os.path.exists("app/database"):
        os.makedirs("app/database")
        print("Created database directory.")
    
    print("\nSetup complete!")
    print("\nTo start the server, run:")
    print("python main.py")
    
    print("\nIMPORTANT: For AI-powered features, make sure to add your API keys in the .env file.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Setup Financial Advisor API environment")
    parser.add_argument("--init-db", action="store_true", help="Initialize the database")
    
    args = parser.parse_args()
    
    setup_environment()
    
    # Initialize database if requested
    if args.init_db:
        try:
            print("\nInitializing database...")
            # Import inside the if block to avoid importing when not needed
            from app.database.database import engine
            from app.models.models import Base
            
            print("Creating database tables...")
            Base.metadata.create_all(bind=engine)
            print("Database initialized successfully.")
        except Exception as e:
            print(f"Error initializing database: {str(e)}")
            sys.exit(1)