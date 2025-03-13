from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import pytz
import os
import requests
from dotenv import load_dotenv

from ..database.database import get_db
from ..models.models import NewsItem
from ..schemas.schemas import NewsItemCreate, NewsItemResponse, NewsSearchRequest

# Load environment variables
load_dotenv()

router = APIRouter()

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

# Get API key from environment
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

@router.post("/", response_model=NewsItemResponse, status_code=status.HTTP_201_CREATED)
def create_news_item(news_item: NewsItemCreate, db: Session = Depends(get_db)):
    """
    Create a new news item.
    """
    db_news_item = NewsItem(
        title=news_item.title,
        content=news_item.content,
        source=news_item.source,
        url=news_item.url,
        publish_date=news_item.publish_date,
        category=news_item.category
    )
    
    db.add(db_news_item)
    db.commit()
    db.refresh(db_news_item)
    
    return db_news_item

@router.get("/", response_model=List[NewsItemResponse])
def get_news_items(
    limit: Optional[int] = 10,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get news items, optionally filtered by category.
    """
    query = db.query(NewsItem)
    
    if category:
        query = query.filter(NewsItem.category == category)
    
    news_items = query.order_by(NewsItem.publish_date.desc()).limit(limit).all()
    
    return news_items

@router.get("/{news_id}", response_model=NewsItemResponse)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    """
    Get a specific news item by ID.
    """
    db_news_item = db.query(NewsItem).filter(NewsItem.id == news_id).first()
    if db_news_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News item not found"
        )
    
    return db_news_item

@router.post("/search")
def search_financial_news(search_request: NewsSearchRequest):
    """
    Search for financial news using the Tavily API.
    """
    if not TAVILY_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Tavily API key not configured"
        )
    
    # Add India-specific context to the query
    india_query = f"{search_request.query} India finance market NSE BSE"
    
    try:
        # Call Tavily API
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": india_query,
                "search_depth": "advanced",
                "max_results": search_request.max_results or 5,
                "include_domains": ["economictimes.indiatimes.com", "financialexpress.com", "moneycontrol.com", "livemint.com", "businesstoday.in"]
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Tavily API error: {response.text}"
            )
        
        data = response.json()
        
        # Format results
        results = []
        for item in data.get("results", []):
            results.append({
                "title": item.get("title", ""),
                "content": item.get("content", ""),
                "url": item.get("url", ""),
                "publish_date": item.get("published_date", datetime.now(IST).isoformat()),
                "source": item.get("source", ""),
                "score": item.get("score", 0)
            })
        
        return {"results": results, "query": search_request.query}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching news: {str(e)}"
        )

@router.get("/category/{category}")
def get_news_by_category(category: str, limit: Optional[int] = 5, db: Session = Depends(get_db)):
    """
    Get news items by category.
    """
    news_items = db.query(NewsItem).filter(NewsItem.category == category).order_by(NewsItem.publish_date.desc()).limit(limit).all()
    
    if not news_items and TAVILY_API_KEY:
        # If no news in database, try to fetch from Tavily API
        try:
            search_request = NewsSearchRequest(query=f"India {category} finance news", max_results=limit)
            return search_financial_news(search_request)
        except Exception:
            # Return empty list if API call fails
            return []
    
    return news_items