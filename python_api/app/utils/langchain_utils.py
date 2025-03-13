import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser

# Load environment variables
load_dotenv()

# Get API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_llm():
    """Get the language model."""
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY not found in environment variables")
    
    return ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2, api_key=OPENAI_API_KEY)

def analyze_financial_document(document_content: str, analysis_type: str) -> Dict[str, Any]:
    """
    Analyze a financial document using LangChain and return insights.
    
    Args:
        document_content (str): The content of the document to analyze
        analysis_type (str): Type of analysis - 'investment', 'forecast', or 'risk'
        
    Returns:
        Dict containing analysis summary, insights, and recommendations
    """
    llm = get_llm()
    
    # Create appropriate prompt based on analysis type
    if analysis_type == "investment":
        prompt = PromptTemplate.from_template(
            """
            You are an expert Indian financial analyst specializing in investment analysis. 
            Analyze the following investment document in the context of Indian markets and regulations.
            Focus on stock performance, mutual funds, and other investment vehicles common in India.
            All monetary values should be considered in Indian Rupees (INR).
            
            Document content:
            {document_content}
            
            Provide the following in your analysis:
            1. A concise summary of the investment portfolio or document (2-3 sentences)
            2. Five key insights about the investments (consider Indian tax implications, SEBI regulations, etc.)
            3. Five actionable recommendations for optimizing the portfolio for the Indian market
            
            Format your response as a JSON object with these keys: summary, insights (as an array), recommendations (as an array).
            """
        )
    elif analysis_type == "forecast":
        prompt = PromptTemplate.from_template(
            """
            You are an expert Indian financial analyst specializing in financial forecasting.
            Analyze the following financial forecast document in the context of the Indian economy.
            Consider Indian inflation rates, GDP growth projections, and RBI policies.
            All monetary values should be considered in Indian Rupees (INR).
            
            Document content:
            {document_content}
            
            Provide the following in your analysis:
            1. A concise summary of the financial forecast (2-3 sentences)
            2. Five key insights from the forecast (including Indian economic factors)
            3. Five actionable recommendations based on the forecast
            
            Format your response as a JSON object with these keys: summary, insights (as an array), recommendations (as an array).
            """
        )
    elif analysis_type == "risk":
        prompt = PromptTemplate.from_template(
            """
            You are an expert Indian financial analyst specializing in risk assessment.
            Analyze the following risk assessment document in the context of Indian financial markets.
            Consider Indian regulatory compliance, market volatility specific to Indian exchanges (NSE/BSE), and rupee fluctuations.
            All monetary values should be considered in Indian Rupees (INR).
            
            Document content:
            {document_content}
            
            Provide the following in your analysis:
            1. A concise summary of the risk profile (2-3 sentences)
            2. Five key risk insights (specific to Indian market conditions)
            3. Five actionable risk mitigation recommendations for Indian investors
            
            Format your response as a JSON object with these keys: summary, insights (as an array), recommendations (as an array).
            """
        )
    else:
        raise ValueError(f"Unsupported analysis type: {analysis_type}")
    
    # Create and run the chain
    chain = (
        {"document_content": lambda x: x}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    try:
        result = chain.invoke(document_content)
        # Basic parsing - in a real app, you'd want more robust JSON parsing with error handling
        import json
        parsed_result = json.loads(result)
        return {
            "summary": parsed_result.get("summary", ""),
            "insights": parsed_result.get("insights", []),
            "recommendations": parsed_result.get("recommendations", [])
        }
    except Exception as e:
        raise Exception(f"Failed to analyze document: {str(e)}")

def generate_chat_response(user_message: str, chat_history: List[Dict[str, Any]] = None) -> str:
    """
    Generate a response to a user's chat message using LangChain.
    
    Args:
        user_message (str): The user's message
        chat_history (List[Dict]): Previous chat messages
        
    Returns:
        str: The generated response
    """
    if chat_history is None:
        chat_history = []
    
    llm = get_llm()
    
    # Format chat history for the prompt
    formatted_history = ""
    for msg in chat_history[-5:]:  # Use only the last 5 messages for context
        role = "User" if msg.get("is_user", True) else "Assistant"
        formatted_history += f"{role}: {msg.get('message', '')}\n"
    
    prompt = PromptTemplate.from_template(
        """
        You are a knowledgeable financial advisor specializing in Indian finance and investments.
        You provide advice on Indian stocks, mutual funds, taxation, retirement planning, and general
        financial management within the context of Indian laws and regulations.
        All monetary values should be assumed to be in Indian Rupees (INR).
        
        When making recommendations, consider Indian-specific factors like:
        - Indian tax laws (income tax slabs, LTCG, STCG, etc.)
        - Indian investment vehicles (PPF, NPS, ELSS funds, etc.)
        - Indian market indices (NIFTY, SENSEX)
        - RBI policies and Indian inflation rates
        
        Chat history:
        {chat_history}
        
        User: {user_message}
        
        Provide a helpful, concise response:
        """
    )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    
    try:
        response = chain.run(chat_history=formatted_history, user_message=user_message)
        return response.strip()
    except Exception as e:
        raise Exception(f"Failed to generate chat response: {str(e)}")