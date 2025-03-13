from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import pytz

from ..database.database import get_db
from ..models.models import ChatMessage, User
from ..schemas.schemas import ChatMessageCreate, ChatMessageResponse
from ..utils.langchain_utils import generate_chat_response

router = APIRouter()

# Set the timezone to Indian Standard Time
IST = pytz.timezone('Asia/Kolkata')

@router.post("/", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_message(message: ChatMessageCreate, db: Session = Depends(get_db)):
    """
    Create a new chat message and generate a response.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == message.user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create user message
    db_message = ChatMessage(
        message=message.message,
        is_user=True,
        related_to=message.related_to,
        user_id=message.user_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Get recent chat history for context
    chat_history = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == message.user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(10)
        .all()
    )
    
    # Format chat history for the LLM
    formatted_history = [
        {"message": msg.message, "is_user": msg.is_user}
        for msg in reversed(chat_history)
    ]
    
    try:
        # Generate response using LangChain
        ai_response = generate_chat_response(message.message, formatted_history)
        
        # Save AI response
        db_ai_message = ChatMessage(
            message=ai_response,
            is_user=False,
            related_to=message.related_to,
            user_id=message.user_id
        )
        
        db.add(db_ai_message)
        db.commit()
        db.refresh(db_ai_message)
        
        return db_ai_message
    except Exception as e:
        # Handle errors in AI response generation
        error_message = f"Sorry, I couldn't generate a response: {str(e)}"
        db_error_message = ChatMessage(
            message=error_message,
            is_user=False,
            related_to=message.related_to,
            user_id=message.user_id
        )
        
        db.add(db_error_message)
        db.commit()
        db.refresh(db_error_message)
        
        return db_error_message

@router.get("/user/{user_id}", response_model=List[ChatMessageResponse])
def get_user_chat_history(
    user_id: int, 
    limit: Optional[int] = 20,
    db: Session = Depends(get_db)
):
    """
    Get chat history for a specific user.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get chat messages
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
    
    # Return in chronological order
    return list(reversed(messages))