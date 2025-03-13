import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  title: string;
  content: string;
  source: string;
  publishDate: Date;
  url: string;
}

export default function NewsCard({ title, content, source, publishDate, url }: NewsCardProps) {
  const formattedTime = formatDistanceToNow(new Date(publishDate), { addSuffix: true });
  
  const truncatedContent = content.length > 120 
    ? content.substring(0, 120) + "..." 
    : content;

  const handleReadMore = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-2">{truncatedContent}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{source} • {formattedTime}</span>
        <button 
          className="text-primary text-xs font-medium hover:text-blue-700"
          onClick={handleReadMore}
        >
          Read more
        </button>
      </div>
    </div>
  );
}
