import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Lightbulb, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendChatMessage, getChatHistory } from "@/lib/api";
import ChatInterface from "@/components/shared/ChatInterface";
import FileUploader from "@/components/shared/FileUploader";
import { ChatMessage } from "@shared/schema";

interface AIAdvisorProps {
  userId: number;
}

export default function AIAdvisor({ userId }: AIAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const history = await getChatHistory(userId, 50);
        setMessages(history);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      }
    };

    fetchChatHistory();
  }, [userId, toast]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setLoading(true);
    try {
      const response = await sendChatMessage(userId, inputMessage);
      setMessages((prev) => [...prev, response]);
      setInputMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload logic
    toast({
      title: "Document uploaded",
      description: "Your document is being processed",
    });
    setShowUploader(false);
  };

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">AI Financial Advisor</h2>
          <Button 
            className="bg-primary text-white" 
            onClick={() => setShowUploader(!showUploader)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {showUploader && (
          <div className="mb-4">
            <FileUploader 
              onFileSelected={handleFileUpload} 
              acceptedFileTypes=".pdf" 
              maxSize={10} 
            />
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 text-sm">
            Based on your portfolio, I recommend diversifying into tech stocks. Your current exposure to financial sector is high (45% of portfolio).
          </p>
          <div className="mt-3">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <Lightbulb className="h-3 w-3 mr-1" />
              AI Insight
            </Badge>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <ChatInterface 
            messages={messages} 
            isLoading={loading}
          />
          
          <div className="mt-2 flex rounded-md shadow-sm">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="rounded-r-none"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button 
              className="rounded-l-none bg-primary hover:bg-blue-700"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your conversation is private and secure. You can ask about investment advice, budget optimization, or retirement planning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
