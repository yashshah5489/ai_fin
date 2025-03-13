import { useRef, useEffect } from "react";
import { ChatMessage } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default function ChatInterface({ messages, isLoading = false }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (timestamp: Date | string) => {
    return format(new Date(timestamp), "h:mm a");
  };

  return (
    <div className="flex flex-col space-y-4 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-start justify-center py-6">
          <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start ${
            message.isUser ? "justify-end" : ""
          }`}
        >
          {!message.isUser && (
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          )}

          <div
            className={`mx-3 py-2 px-3 rounded-lg max-w-[75%] ${
              message.isUser
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            <p
              className={`mt-1 text-xs ${
                message.isUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </p>
          </div>

          {message.isUser && (
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3 bg-gray-100 rounded-lg py-2 px-3">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
