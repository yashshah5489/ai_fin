import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/shared/FileUploader";
import ChatInterface from "@/components/shared/ChatInterface";
import { BarChart, Bot, FileUp, HelpCircle, Lightbulb, Send } from "lucide-react";
import { searchNews } from "@/lib/api";
import { getChatHistory, sendChatMessage } from "@/lib/api";
import { ChatMessage, NewsItem } from "@shared/schema";
import NewsCard from "@/components/shared/NewsCard";

export default function AIAdvisor() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsItem[]>([]);
  const [newsQuery, setNewsQuery] = useState("");
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const { toast } = useToast();

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // Using a fixed user ID for demo purposes
        const userId = 1;
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
  }, [toast]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    try {
      // Using a fixed user ID for demo purposes
      const userId = 1;
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
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    toast({
      title: "Document uploaded",
      description: "Your document is being processed for AI analysis",
    });
    setShowUploader(false);
  };

  const handleSearchNews = async () => {
    if (!newsQuery.trim()) return;
    
    setIsSearchingNews(true);
    try {
      const results = await searchNews(newsQuery);
      setNewsResults(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for financial news",
        variant: "destructive",
      });
    } finally {
      setIsSearchingNews(false);
    }
  };

  return (
    <DashboardLayout
      title="AI Advisor"
      description="Get AI-powered financial advice and insights"
    >
      <Tabs defaultValue="chat" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="news">News Search</TabsTrigger>
          <TabsTrigger value="insights">Personalized Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chat with Your AI Financial Advisor</CardTitle>
              <Button 
                className="bg-primary text-white" 
                onClick={() => setShowUploader(!showUploader)}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Upload Financial Document
              </Button>
            </CardHeader>
            <CardContent>
              {showUploader && (
                <div className="mb-6">
                  <FileUploader
                    onFileSelected={handleFileUpload}
                    acceptedFileTypes=".pdf"
                    maxSize={10}
                    label="Upload your financial documents for AI analysis"
                  />
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Pro Tips</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      You can ask about investment strategies, retirement planning, tax optimization, or debt management. For more personalized advice, upload your financial documents.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 min-h-80">
                <ChatInterface
                  messages={messages}
                  isLoading={isLoading}
                />
              </div>
              
              <div className="flex rounded-md shadow-sm">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your financial question..."
                  className="rounded-r-none"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  className="rounded-l-none bg-primary hover:bg-blue-700"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Financial News Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex rounded-md shadow-sm">
                  <Input
                    value={newsQuery}
                    onChange={(e) => setNewsQuery(e.target.value)}
                    placeholder="Search for financial news topics..."
                    className="rounded-r-none"
                    onKeyPress={(e) => e.key === "Enter" && handleSearchNews()}
                  />
                  <Button
                    className="rounded-l-none bg-primary hover:bg-blue-700"
                    onClick={handleSearchNews}
                    disabled={isSearchingNews}
                  >
                    {isSearchingNews ? "Searching..." : "Search"}
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Search for topics like "interest rates", "stock market", "cryptocurrency", etc.
                </p>
              </div>
              
              {isSearchingNews ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500">Searching for relevant news...</p>
                </div>
              ) : newsResults.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Results for "{newsQuery}"</h3>
                  <div className="space-y-4">
                    {newsResults.map((item) => (
                      <NewsCard
                        key={item.id}
                        title={item.title}
                        content={item.content}
                        source={item.source}
                        publishDate={new Date(item.publishDate)}
                        url={item.url}
                      />
                    ))}
                  </div>
                </div>
              ) : newsQuery ? (
                <div className="py-8 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No results found for "{newsQuery}"</p>
                  <p className="text-gray-500 text-sm mt-1">Try different keywords or broader topics</p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Search for financial news</p>
                  <p className="text-gray-500 text-sm mt-1">Enter keywords to find relevant financial news</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Financial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">AI-Generated Insights</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Based on your financial data, here are some personalized insights and recommendations.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Investment
                    </Badge>
                  </div>
                  <h3 className="text-md font-medium mb-2">Portfolio Diversification</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Your portfolio is heavily weighted toward financial sector stocks (45%). Consider diversifying into technology and healthcare sectors to reduce sector-specific risk.
                  </p>
                  <Button variant="outline" className="mt-2 text-primary text-sm">Learn More</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Savings
                    </Badge>
                  </div>
                  <h3 className="text-md font-medium mb-2">Emergency Fund</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Your emergency fund covers 2 months of expenses. Consider increasing it to 3-6 months for better financial security.
                  </p>
                  <Button variant="outline" className="mt-2 text-primary text-sm">Learn More</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Retirement
                    </Badge>
                  </div>
                  <h3 className="text-md font-medium mb-2">Retirement Contributions</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    You're currently contributing 10% to your retirement accounts. Consider increasing to 15% to stay on track with your retirement goals.
                  </p>
                  <Button variant="outline" className="mt-2 text-primary text-sm">Learn More</Button>
                </div>
                
                <div className="text-center mt-8">
                  <Button className="bg-primary">
                    <BarChart className="h-4 w-4 mr-2" />
                    Get Detailed Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
