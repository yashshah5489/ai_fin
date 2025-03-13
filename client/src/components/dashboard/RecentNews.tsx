import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getNewsItems } from "@/lib/api";
import { NewsItem } from "@shared/schema";
import NewsCard from "../shared/NewsCard";

interface RecentNewsProps {
  limit?: number;
  category?: string;
}

export default function RecentNews({ limit = 4, category }: RecentNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await getNewsItems(limit, category);
        setNews(newsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load financial news",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [limit, category, toast]);

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial News</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No financial news available</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {news.map((item) => (
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
        )}
        
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full border border-gray-300 bg-white hover:bg-gray-50"
          >
            View All News
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
