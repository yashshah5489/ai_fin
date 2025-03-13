import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertDocumentSchema, 
  insertChatMessageSchema,
  insertFinancialDataSchema,
  insertNewsItemSchema
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { ZodError } from "zod";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function handleZodError(error: ZodError, res: Response) {
  return res.status(400).json({
    message: "Validation error",
    errors: error.errors.map(err => ({
      path: err.path.join("."),
      message: err.message
    }))
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Define API routes
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Document routes
  app.post("/api/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileContent = req.file.buffer.toString("base64");
      const fileName = req.file.originalname;
      const fileType = path.extname(fileName).replace(".", "");
      
      if (fileType !== "pdf") {
        return res.status(400).json({ message: "Only PDF files are supported" });
      }
      
      const documentData = insertDocumentSchema.parse({
        userId: parseInt(req.body.userId),
        title: req.body.title || fileName,
        fileContent,
        fileType,
        category: req.body.category,
        uploadDate: new Date(),
        analysis: {
          summary: "",
          insights: [],
          recommendations: []
        }
      });
      
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      console.error(error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get("/api/users/:userId/documents", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const category = req.query.category as string | undefined;
      
      const documents = await storage.getDocumentsByUser(userId, category);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.patch("/api/documents/:id/analysis", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const updatedDocument = await storage.updateDocument(documentId, {
        analysis: req.body
      });
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document analysis" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const success = await storage.deleteDocument(documentId);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Chat message routes
  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        userId: req.body.userId,
        message: req.body.message,
        isUser: true,
        timestamp: new Date(),
        relatedTo: req.body.relatedTo
      });
      
      await storage.createChatMessage(messageData);
      
      // Process the response via Groq API in a real implementation
      // For now, we'll create a simple response
      const responseData = insertChatMessageSchema.parse({
        userId: req.body.userId,
        message: `AI response to: ${req.body.message}`,
        isUser: false,
        timestamp: new Date(),
        relatedTo: req.body.relatedTo
      });
      
      const aiResponse = await storage.createChatMessage(responseData);
      res.json(aiResponse);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/users/:userId/chat", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const messages = await storage.getChatMessagesByUser(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Financial data routes
  app.post("/api/financial-data", async (req, res) => {
    try {
      const financialData = insertFinancialDataSchema.parse({
        ...req.body,
        date: new Date(req.body.date) 
      });
      
      const data = await storage.createFinancialData(financialData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create financial data" });
    }
  });

  app.get("/api/users/:userId/financial-data", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.query.type as string | undefined;
      
      const data = await storage.getFinancialDataByUser(userId, type);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial data" });
    }
  });

  app.patch("/api/financial-data/:id", async (req, res) => {
    try {
      const dataId = parseInt(req.params.id);
      const updatedData = await storage.updateFinancialData(dataId, req.body);
      
      if (!updatedData) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      
      res.json(updatedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial data" });
    }
  });

  app.delete("/api/financial-data/:id", async (req, res) => {
    try {
      const dataId = parseInt(req.params.id);
      const success = await storage.deleteFinancialData(dataId);
      
      if (!success) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete financial data" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const category = req.query.category as string | undefined;
      
      const news = await storage.getNewsItems(limit, category);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // AI analysis endpoints for specialized modules
  app.post("/api/ai/analyze-investment", async (req, res) => {
    try {
      const { documentId, userId } = req.body;
      
      if (!documentId) {
        return res.status(400).json({ message: "Document ID is required" });
      }
      
      const document = await storage.getDocument(parseInt(documentId));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // In a real implementation, this would use Groq API to analyze the document
      // For now, we'll return a mock analysis
      const analysis = {
        summary: "Investment portfolio analysis summary",
        insights: [
          "Your portfolio is well diversified",
          "Consider increasing allocation to technology sector",
          "Reduce exposure to financial sector"
        ],
        recommendations: [
          "Rebalance portfolio quarterly",
          "Consider adding international exposure",
          "Review fee structure with your broker"
        ]
      };
      
      await storage.updateDocument(parseInt(documentId), { analysis });
      
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze investment document" });
    }
  });

  app.post("/api/ai/analyze-forecast", async (req, res) => {
    try {
      const { documentId, userId } = req.body;
      
      if (!documentId) {
        return res.status(400).json({ message: "Document ID is required" });
      }
      
      const document = await storage.getDocument(parseInt(documentId));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // In a real implementation, this would use Groq API to analyze the document
      // For now, we'll return a mock analysis
      const analysis = {
        summary: "Financial forecasting analysis summary",
        insights: [
          "Projected growth rate of 8.5% over next 5 years",
          "Cash flow adequate for planned expansion",
          "Potential liquidity issues in Q3 2023"
        ],
        recommendations: [
          "Secure additional line of credit",
          "Implement more aggressive accounts receivable collection",
          "Consider delaying capital expenditures until Q4"
        ]
      };
      
      await storage.updateDocument(parseInt(documentId), { analysis });
      
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze forecast document" });
    }
  });

  app.post("/api/ai/analyze-risk", async (req, res) => {
    try {
      const { documentId, userId } = req.body;
      
      if (!documentId) {
        return res.status(400).json({ message: "Document ID is required" });
      }
      
      const document = await storage.getDocument(parseInt(documentId));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // In a real implementation, this would use Groq API to analyze the document
      // For now, we'll return a mock analysis
      const analysis = {
        summary: "Risk analysis summary",
        insights: [
          "Portfolio volatility is higher than benchmark",
          "Sector concentration risk identified",
          "Currency exposure creating additional risk"
        ],
        recommendations: [
          "Add more defensive assets to reduce volatility",
          "Diversify across additional sectors",
          "Consider hedging currency exposure"
        ]
      };
      
      await storage.updateDocument(parseInt(documentId), { analysis });
      
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze risk document" });
    }
  });

  // Route to fetch news using Tavily API
  app.get("/api/news/search", async (req, res) => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // In a real implementation, this would call the Tavily API
      // For now, we'll return a set of sample news
      const currentDate = new Date();
      
      const newsItems = [
        {
          title: `Latest financial news related to: ${query}`,
          content: "This is the content of the first news article...",
          source: "Financial Times",
          url: "https://ft.com/article1",
          publishDate: new Date(currentDate.setHours(currentDate.getHours() - 2)),
          category: "Finance",
          relevanceScore: 95
        },
        {
          title: `Market update on: ${query}`,
          content: "This is the content of the second news article...",
          source: "Wall Street Journal",
          url: "https://wsj.com/article2",
          publishDate: new Date(currentDate.setHours(currentDate.getHours() - 5)),
          category: "Markets",
          relevanceScore: 88
        }
      ];
      
      for (const item of newsItems) {
        await storage.createNewsItem(item);
      }
      
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to search for news" });
    }
  });

  return httpServer;
}
