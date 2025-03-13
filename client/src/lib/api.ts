import { apiRequest } from "./queryClient";
import { User, Document, ChatMessage, FinancialData, NewsItem } from "@shared/schema";

// User API
export async function updateUserProfile(userId: number, data: Partial<User>): Promise<Omit<User, "password">> {
  const response = await apiRequest("PATCH", `/api/users/${userId}`, data);
  return response.json();
}

export async function getUserProfile(userId: number): Promise<Omit<User, "password">> {
  const response = await apiRequest("GET", `/api/users/${userId}`);
  return response.json();
}

// Document API
export async function uploadDocument(formData: FormData): Promise<Document> {
  const response = await fetch("/api/documents", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upload document");
  }
  
  return response.json();
}

export async function getUserDocuments(userId: number, category?: string): Promise<Document[]> {
  const url = `/api/users/${userId}/documents${category ? `?category=${category}` : ""}`;
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function deleteDocument(documentId: number): Promise<void> {
  await apiRequest("DELETE", `/api/documents/${documentId}`);
}

// Chat API
export async function sendChatMessage(userId: number, message: string, relatedTo?: string): Promise<ChatMessage> {
  const response = await apiRequest("POST", "/api/chat", { userId, message, relatedTo });
  return response.json();
}

export async function getChatHistory(userId: number, limit?: number): Promise<ChatMessage[]> {
  const url = `/api/users/${userId}/chat${limit ? `?limit=${limit}` : ""}`;
  const response = await apiRequest("GET", url);
  return response.json();
}

// Financial Data API
export async function createFinancialData(data: Omit<FinancialData, "id">): Promise<FinancialData> {
  const response = await apiRequest("POST", "/api/financial-data", data);
  return response.json();
}

export async function getUserFinancialData(userId: number, type?: string): Promise<FinancialData[]> {
  const url = `/api/users/${userId}/financial-data${type ? `?type=${type}` : ""}`;
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function updateFinancialData(id: number, data: Partial<FinancialData>): Promise<FinancialData> {
  const response = await apiRequest("PATCH", `/api/financial-data/${id}`, data);
  return response.json();
}

export async function deleteFinancialData(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/financial-data/${id}`);
}

// News API
export async function getNewsItems(limit?: number, category?: string): Promise<NewsItem[]> {
  const url = `/api/news${limit ? `?limit=${limit}` : ""}${category ? `&category=${category}` : ""}`;
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  const response = await apiRequest("GET", `/api/news/search?query=${encodeURIComponent(query)}`);
  return response.json();
}

// AI Analysis API
export async function analyzeInvestmentDocument(documentId: number, userId: number): Promise<{success: boolean, analysis: any}> {
  const response = await apiRequest("POST", "/api/ai/analyze-investment", { documentId, userId });
  return response.json();
}

export async function analyzeForecastDocument(documentId: number, userId: number): Promise<{success: boolean, analysis: any}> {
  const response = await apiRequest("POST", "/api/ai/analyze-forecast", { documentId, userId });
  return response.json();
}

export async function analyzeRiskDocument(documentId: number, userId: number): Promise<{success: boolean, analysis: any}> {
  const response = await apiRequest("POST", "/api/ai/analyze-risk", { documentId, userId });
  return response.json();
}
