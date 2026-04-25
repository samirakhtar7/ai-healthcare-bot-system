import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { getHealthAIResponse } from "../services/gemini";


const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Health Assistant (Gemini). How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const messagesEndRef = useRef(null);
  const lastRequestTime = useRef(0);
  const requestQueue = useRef([]);
  const isProcessing = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process queued messages with delay
  // Keep callback stable (no messages dependency) and use functional state updates
  const processQueue = useCallback(async () => {
    if (isProcessing.current || requestQueue.current.length === 0) return;
    isProcessing.current = true;

    const { message, userMsgObj } = requestQueue.current.shift();

    // Rate limit: wait at least 2 seconds between requests
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime.current;
    if (timeSinceLast < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 2000 - timeSinceLast));
    }

    lastRequestTime.current = Date.now();

    try {
      const aiReply = await getHealthAIResponse(message);

      // Use functional update so we always append to the latest messages
      setMessages((prev) => {
        const botReply = {
          id: prev.length + 1,
          text: aiReply,
          sender: "bot",
          timestamp: new Date(),
        };
        return [...prev, botReply];
      });

      // If response indicates rate limit, show a warning
      if (
        aiReply.includes("rate-limited") ||
        aiReply.includes("try again in a minute")
      ) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      isProcessing.current = false;
      setIsTyping(false);
      // Process next in queue
      if (requestQueue.current.length > 0) {
        processQueue();
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessageText = input.trim();
    const userMessageObj = {
      id: messages.length + 1,
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessageObj]);
    setInput("");
    setIsTyping(true);

    // Add to queue
    requestQueue.current.push({
      message: userMessageText,
      userMsgObj: userMessageObj,
    });

    if (!isProcessing.current) {
      processQueue();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[60vh] md:h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">AI Health Assistant (Gemini)</span>
        </div>
        {isRateLimited && (
          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full animate-pulse">
            Rate limited – using local responses
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-full sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm whitespace-pre-wrap ${msg.sender === "user" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {msg.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a health question... (rate limits may apply)"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          ⚠️ AI information – not medical advice. Free API has rate limits; if
          slow, fallback responses will appear.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
