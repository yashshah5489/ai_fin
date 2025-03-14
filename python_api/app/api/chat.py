"""
API routes for chat messages and AI-powered conversations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..schemas.schemas import ChatMessageCreate, ChatMessageResponse
from ..models.models import ChatMessage, User
from ..database.database import get_db
from ..utils.langchain_utils import generate_chat_response

# Create router
router = APIRouter()

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
    
    # Create user message in database
    db_message = ChatMessage(
        message=message.message,
        is_user=True,
        related_to=message.related_to,
        user_id=message.user_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Get recent chat history
    chat_history = db.query(ChatMessage)\
        .filter(ChatMessage.user_id == message.user_id)\
        .order_by(ChatMessage.timestamp.desc())\
        .limit(10)\
        .all()
    chat_history.reverse()  # Chronological order
    
    # Format chat history for the AI
    formatted_history = [
        {"role": "user" if msg.is_user else "assistant", "content": msg.message}
        for msg in chat_history
    ]
    
    try:
        # Generate AI response
        ai_response = await generate_chat_response(
            message.message, 
            formatted_history,
            related_to=message.related_to
        )
        
        # Save AI response to database
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
        # If AI response generation fails, return an error message
        error_message = f"I apologize, but I am unable to respond at the moment. Error: {str(e)}"
        
        db_ai_message = ChatMessage(
            message=error_message,
            is_user=False,
            related_to=message.related_to,
            user_id=message.user_id
        )
        
        db.add(db_ai_message)
        db.commit()
        db.refresh(db_ai_message)
        
        return db_ai_message

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
    messages = db.query(ChatMessage)\
        .filter(ChatMessage.user_id == user_id)\
        .order_by(ChatMessage.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return messages