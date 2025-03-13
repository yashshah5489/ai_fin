"""
Utility functions for working with LangChain and AI models.
All functions are designed for the Indian financial context.
"""
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage, AIMessage
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# Constants for prompts
INVESTMENT_ANALYSIS_TEMPLATE = """
You are an expert investment advisor focusing on the Indian market. Analyze the following investment document and provide insights and recommendations for Indian investors.

Document content:
{document_content}

Provide a concise response in the following format:
1. Summary: A short summary of the document
2. Key Insights: List the most important insights relevant to Indian investors
3. Recommendations: Specific investment recommendations for Indian investors considering the current market conditions, tax laws, and regulations in India

Focus on Indian financial context, mention specific Indian investment vehicles (like PPF, NPS, ELSS), and provide actionable insights relevant to Indian investors.
Response should be in INR currency where applicable.
"""

FORECAST_ANALYSIS_TEMPLATE = """
You are an expert financial forecasting advisor focusing on the Indian market. Analyze the following financial forecast document and provide insights and recommendations for Indian investors and businesses.

Document content:
{document_content}

Provide a concise response in the following format:
1. Summary: A short summary of the document
2. Key Insights: List the most important forecast insights relevant to the Indian economy and markets
3. Recommendations: Specific recommendations for Indian investors and businesses based on these forecasts

Focus on Indian financial context, mention specific impacts on Indian sectors, and provide actionable insights relevant to the Indian economy.
Response should be in INR currency where applicable and consider Indian inflation rates, GDP growth forecasts, and market conditions.
"""

RISK_ANALYSIS_TEMPLATE = """
You are an expert risk assessment advisor focusing on the Indian market. Analyze the following risk assessment document and provide insights and recommendations for Indian investors and businesses.

Document content:
{document_content}

Provide a concise response in the following format:
1. Summary: A short summary of the document
2. Key Risk Factors: List the most important risk factors relevant to Indian investors and businesses
3. Risk Mitigation Recommendations: Specific recommendations for mitigating these risks in the Indian context

Focus on Indian financial context, mention specific regulatory and compliance considerations in India, and provide actionable risk management strategies relevant to Indian investors and businesses.
Response should consider Indian market volatility, regulatory environment, and economic factors specific to India.
"""

CHAT_SYSTEM_PROMPT = """
You are an AI financial advisor specializing in Indian financial matters. You provide helpful, accurate, and relevant advice to users about personal finance, investments, taxes, and financial planning in India.

Always consider the following:
1. All financial information should be in the context of Indian financial systems and regulations
2. All monetary values should be in Indian Rupees (INR)
3. Reference Indian financial instruments, banks, and institutions where appropriate
4. Consider Indian tax laws, including income tax slabs, GST, capital gains tax, etc.
5. Be familiar with Indian retirement options like PPF, EPF, NPS, etc.
6. Be familiar with Indian investment options like mutual funds, stocks, bonds, real estate, gold, etc.
7. Consider the typical financial goals and challenges faced by Indians

Your responses should be:
- Accurate and up-to-date as of March 2023
- Tailored to Indian financial landscape
- Professional but conversational
- Educational without being condescending
- Balanced in presenting benefits and risks
- Clear about when you're providing general information vs specific advice
- Clear about limitations of your knowledge

Always clarify if you need additional information from the user to provide better guidance.
"""

def get_llm():
    """Get the language model."""
    # Check if API key is available
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")
    
    # Initialize the model
    return ChatOpenAI(
        api_key=api_key,
        model="gpt-3.5-turbo",
        temperature=0.2,
    )

async def analyze_financial_document(document_content: str, analysis_type: str) -> Dict[str, Any]:
    """
    Analyze a financial document using LangChain and return insights.
    
    Args:
        document_content (str): The content of the document to analyze
        analysis_type (str): Type of analysis - 'investment', 'forecast', or 'risk'
        
    Returns:
        Dict containing analysis summary, insights, and recommendations
    """
    # Select the appropriate template
    if analysis_type == "investment":
        template = INVESTMENT_ANALYSIS_TEMPLATE
    elif analysis_type == "forecast":
        template = FORECAST_ANALYSIS_TEMPLATE
    elif analysis_type == "risk":
        template = RISK_ANALYSIS_TEMPLATE
    else:
        raise ValueError(f"Invalid analysis type: {analysis_type}")
    
    # Create prompt
    prompt = PromptTemplate(
        input_variables=["document_content"],
        template=template
    )
    
    # Create chain
    llm = get_llm()
    chain = LLMChain(llm=llm, prompt=prompt)
    
    # Run chain
    result = await chain.arun(document_content=document_content)
    
    # Parse result
    # This is a simple parser that expects a specific format
    # In a real application, you might want to use a more robust parser
    lines = result.strip().split("\n")
    
    summary = ""
    insights = []
    recommendations = []
    
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if "Summary:" in line:
            current_section = "summary"
            summary = line.replace("Summary:", "").strip()
        elif "Key Insights:" in line or "Key Risk Factors:" in line:
            current_section = "insights"
        elif "Recommendations:" in line or "Risk Mitigation Recommendations:" in line:
            current_section = "recommendations"
        elif current_section == "insights" and (line.startswith("- ") or line.startswith("* ") or line[0].isdigit()):
            insights.append(line.lstrip("- *0123456789. "))
        elif current_section == "recommendations" and (line.startswith("- ") or line.startswith("* ") or line[0].isdigit()):
            recommendations.append(line.lstrip("- *0123456789. "))
        elif current_section == "summary":
            summary += " " + line
    
    return {
        "summary": summary,
        "insights": insights,
        "recommendations": recommendations
    }

async def generate_chat_response(user_message: str, chat_history: List[Dict[str, Any]] = None, related_to: Optional[str] = None) -> str:
    """
    Generate a response to a user's chat message using LangChain.
    
    Args:
        user_message (str): The user's message
        chat_history (List[Dict]): Previous chat messages
        related_to (str): The topic or category the message relates to
        
    Returns:
        str: The generated response
    """
    llm = get_llm()
    
    # Prepare messages
    messages = []
    
    # Add system prompt
    system_prompt = CHAT_SYSTEM_PROMPT
    
    # Add topic-specific context if available
    if related_to:
        if related_to == "investment":
            system_prompt += "\nThis conversation is specifically about investments in India. Focus on Indian investment vehicles, strategies, and considerations."
        elif related_to == "tax":
            system_prompt += "\nThis conversation is specifically about taxation in India. Focus on Indian tax laws, deductions, exemptions, and filing requirements."
        elif related_to == "retirement":
            system_prompt += "\nThis conversation is specifically about retirement planning in India. Focus on Indian retirement vehicles like PPF, EPF, NPS, and other strategies."
        elif related_to == "insurance":
            system_prompt += "\nThis conversation is specifically about insurance in India. Focus on Indian insurance products, regulations, and considerations."
        elif related_to == "budget":
            system_prompt += "\nThis conversation is specifically about budgeting and personal finance in India. Consider typical Indian income levels, expenses, and financial goals."
    
    messages.append({"role": "system", "content": system_prompt})
    
    # Add chat history if available
    if chat_history:
        for msg in chat_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            messages.append({"role": role, "content": content})
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    # Generate response
    response = await llm.ainvoke(messages)
    
    return response.content