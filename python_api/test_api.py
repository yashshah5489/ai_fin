"""
Simple test script to verify that the Financial Advisor API is working properly.
"""

import requests
import json
import sys

def test_api(base_url="http://localhost:8000"):
    """Test the API endpoints."""
    print(f"Testing Financial Advisor API at {base_url}")
    
    try:
        # Test root endpoint
        print("\nTesting root endpoint...")
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test user creation
        print("\nTesting user creation...")
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword123"
        }
        response = requests.post(f"{base_url}/api/users/", json=user_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            user = response.json()
            user_id = user["id"]
            print(f"Created user with ID: {user_id}")
        else:
            print(f"Response: {response.text}")
            # If user creation fails, try to get an existing user
            response = requests.get(f"{base_url}/api/users/1")
            if response.status_code == 200:
                user_id = 1
                print(f"Using existing user with ID: {user_id}")
            else:
                print("Could not create or find a user. Some tests will be skipped.")
                user_id = None
        
        if user_id:
            # Test financial data creation
            print("\nTesting financial data creation...")
            financial_data = {
                "category": "income",
                "type": "salary",
                "amount": 50000.0,
                "description": "Monthly salary",
                "recurring": True,
                "frequency": "monthly",
                "user_id": user_id
            }
            response = requests.post(f"{base_url}/api/financial/", json=financial_data)
            print(f"Status: {response.status_code}")
            if response.status_code == 201:
                print("Financial data created successfully")
            else:
                print(f"Response: {response.text}")
            
            # Test getting financial data
            print("\nTesting financial data retrieval...")
            response = requests.get(f"{base_url}/api/financial/user/{user_id}")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data)} financial data entries")
            
            # Test chat
            print("\nTesting chat...")
            chat_message = {
                "message": "What are the best mutual funds in India for long-term investment?",
                "user_id": user_id
            }
            response = requests.post(f"{base_url}/api/chat/", json=chat_message)
            print(f"Status: {response.status_code}")
            if response.status_code == 201:
                print("Chat message sent successfully")
                print(f"AI Response: {response.json()['message'][:100]}...")
            else:
                print(f"Response: {response.text}")
        
        # Test news retrieval
        print("\nTesting news retrieval...")
        response = requests.get(f"{base_url}/api/news/?limit=3")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            news = response.json()
            print(f"Found {len(news)} news items")
        
        print("\nAPI tests completed")
        
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to {base_url}")
        print("Make sure the API server is running")
        return False
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    # Use command line argument for base URL if provided
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    test_api(base_url)