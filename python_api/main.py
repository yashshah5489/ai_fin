"""
Main entry point for the Financial Advisor API.
"""
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import app factory
from app import create_app

# Create FastAPI application
app = create_app()

if __name__ == "__main__":
    """
    Run the FastAPI application with Uvicorn.
    
    Uses environment variables:
    - PORT: The port to run the API on (default: 8000)
    - HOST: The host to run the API on (default: 0.0.0.0)
    - DEBUG: Whether to run in debug mode (default: False)
    """
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("DEBUG", "False").lower() == "true"
    
    # Print startup message
    print(f"Starting Financial Advisor API on http://{host}:{port}")
    print(f"API documentation available at http://{host}:{port}/docs")
    print(f"Debug mode: {debug}")
    
    # Run the application
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "error",
    )