"""
Setup script for the Financial Advisor API.
This is not a package installer, but a helper script to set up the development environment.
"""

import os
import sys
import subprocess

def setup_environment():
    """Set up the development environment."""
    print("Setting up the Financial Advisor API development environment...")
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("Error: requirements.txt not found. Please run this script from the python_api directory.")
        sys.exit(1)
    
    # Install dependencies
    print("Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Create uploads directory
    uploads_dir = os.path.join(os.getcwd(), "uploads")
    if not os.path.exists(uploads_dir):
        print("Creating uploads directory...")
        os.makedirs(uploads_dir)
    
    # Check for .env file
    env_file = os.path.join(os.getcwd(), ".env")
    if not os.path.exists(env_file):
        print("Warning: .env file not found. Creating a template .env file...")
        with open(env_file, "w") as f:
            f.write("""# Database configuration
DATABASE_URL=sqlite:///./financial_advisor.db

# API Keys for external services (please replace with your own keys)
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# Application settings
DEBUG=True
SECRET_KEY=your_secret_key_here
""")
        print("Please edit the .env file and add your API keys.")
    
    print("Setup complete! You can now run the API with 'python main.py'")

if __name__ == "__main__":
    setup_environment()