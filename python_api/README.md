# Financial Advisor API

An India-specific financial analysis application with AI-powered insights, PDF processing capabilities, and multiple specialized modules.

## Features

- User management with preferences
- Document upload and analysis (PDF)
- AI-powered financial analysis for investments, forecasting, and risk assessment
- Chat interface with AI financial advisor
- Financial data tracking and reporting
- Financial news aggregation
- India-specific focus with INR currency

## Requirements

- Python 3.11+
- Dependencies listed in `requirements.txt`

## Setup

1. Clone the repository
2. Navigate to the python_api directory
3. Run the setup script:
   ```
   python setup.py
   ```
4. Edit the `.env` file to add your API keys
5. Start the server:
   ```
   python main.py
   ```

## API Endpoints

### Users

- `POST /api/users/` - Create a new user
- `GET /api/users/{user_id}` - Get user details
- `PUT /api/users/{user_id}` - Update user details

### Documents

- `POST /api/documents/` - Upload a new document
- `GET /api/documents/{document_id}` - Get document details
- `GET /api/documents/user/{user_id}` - Get all documents for a user
- `PUT /api/documents/{document_id}` - Update document metadata
- `DELETE /api/documents/{document_id}` - Delete a document
- `GET /api/documents/{document_id}/content` - Get extracted document content
- `GET /api/documents/{document_id}/data-url` - Get document data URL for display

### Chat

- `POST /api/chat/` - Send a chat message and get AI response
- `GET /api/chat/user/{user_id}` - Get chat history for a user

### Financial Data

- `POST /api/financial/` - Create a new financial data entry
- `GET /api/financial/user/{user_id}` - Get financial data for a user
- `GET /api/financial/{data_id}` - Get a specific financial data entry
- `PUT /api/financial/{data_id}` - Update a financial data entry
- `DELETE /api/financial/{data_id}` - Delete a financial data entry
- `GET /api/financial/summary/{user_id}` - Get financial summary for a user

### News

- `POST /api/news/` - Create a new news item
- `GET /api/news/` - Get news items
- `GET /api/news/{news_id}` - Get a specific news item
- `POST /api/news/search` - Search for financial news
- `GET /api/news/category/{category}` - Get news by category

### Analysis

- `POST /api/analysis/investment` - Analyze an investment document
- `POST /api/analysis/forecast` - Analyze a forecast document
- `POST /api/analysis/risk` - Analyze a risk document

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=sqlite:///./financial_advisor.db
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
DEBUG=True
SECRET_KEY=your_secret_key_here
```

## India-Specific Features

- All financial calculations use INR (Indian Rupees)
- Analysis considers Indian tax laws, regulations, and market conditions
- News search prioritizes Indian financial sources
- Chat assistant provides advice in the context of Indian financial landscape