import { 
  type User, type InsertUser, users,
  type Document, type InsertDocument, documents,
  type ChatMessage, type InsertChatMessage, chatMessages,
  type FinancialData, type InsertFinancialData, financialData,
  type NewsItem, type InsertNewsItem, newsItems
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByUser(userId: number, category?: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, data: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Chat operations
  getChatMessagesByUser(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Financial data operations
  getFinancialDataByUser(userId: number, type?: string): Promise<FinancialData[]>;
  createFinancialData(data: InsertFinancialData): Promise<FinancialData>;
  updateFinancialData(id: number, data: Partial<FinancialData>): Promise<FinancialData | undefined>;
  deleteFinancialData(id: number): Promise<boolean>;
  
  // News operations
  getNewsItems(limit?: number, category?: string): Promise<NewsItem[]>;
  createNewsItem(item: InsertNewsItem): Promise<NewsItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private chatMessages: Map<number, ChatMessage>;
  private financialData: Map<number, FinancialData>;
  private newsItems: Map<number, NewsItem>;
  
  private userCurrentId: number;
  private documentCurrentId: number;
  private chatMessageCurrentId: number;
  private financialDataCurrentId: number;
  private newsItemCurrentId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.chatMessages = new Map();
    this.financialData = new Map();
    this.newsItems = new Map();
    
    this.userCurrentId = 1;
    this.documentCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.financialDataCurrentId = 1;
    this.newsItemCurrentId = 1;
    
    // Add a default user for testing
    this.createUser({
      username: "demo",
      password: "password",
      fullName: "John Doe",
      email: "john@example.com",
      profileImage: "",
      preferences: {
        theme: "light",
        currency: "USD",
        notifications: true
      }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByUser(userId: number, category?: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => 
        doc.userId === userId && 
        (category ? doc.category === category : true)
      );
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentCurrentId++;
    const newDocument: Document = { ...document, id };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, data: Partial<Document>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;
    
    const updatedDocument = { ...existingDocument, ...data };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Chat operations
  async getChatMessagesByUser(userId: number, limit?: number): Promise<ChatMessage[]> {
    const userMessages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return limit ? userMessages.slice(-limit) : userMessages;
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const newMessage: ChatMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
  
  // Financial data operations
  async getFinancialDataByUser(userId: number, type?: string): Promise<FinancialData[]> {
    return Array.from(this.financialData.values())
      .filter(data => 
        data.userId === userId && 
        (type ? data.type === type : true)
      );
  }
  
  async createFinancialData(data: InsertFinancialData): Promise<FinancialData> {
    const id = this.financialDataCurrentId++;
    const newData: FinancialData = { ...data, id };
    this.financialData.set(id, newData);
    return newData;
  }
  
  async updateFinancialData(id: number, data: Partial<FinancialData>): Promise<FinancialData | undefined> {
    const existingData = this.financialData.get(id);
    if (!existingData) return undefined;
    
    const updatedData = { ...existingData, ...data };
    this.financialData.set(id, updatedData);
    return updatedData;
  }
  
  async deleteFinancialData(id: number): Promise<boolean> {
    return this.financialData.delete(id);
  }
  
  // News operations
  async getNewsItems(limit?: number, category?: string): Promise<NewsItem[]> {
    const filteredNews = Array.from(this.newsItems.values())
      .filter(item => category ? item.category === category : true)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    return limit ? filteredNews.slice(0, limit) : filteredNews;
  }
  
  async createNewsItem(item: InsertNewsItem): Promise<NewsItem> {
    const id = this.newsItemCurrentId++;
    const newItem: NewsItem = { ...item, id };
    this.newsItems.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();
