import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { SendHorizonal } from "lucide-react";
import { BeatLoader } from "react-spinners";
import imgRobot from '/public/images/robot.png';

interface Message {
  content: string;
  isUser: boolean;
}

interface TokenData {
  address?: string;
  name?: string;
  symbol?: string;
  icon?: string;
  price?: number;
  marketCap?: number;
  supply?: number;
  priceChange24h?: number;
  volume24h?: number;
  creator?: string;
  createdTime?: number;
  description?: string;
  image?: string;
  activities?: {
    activityType: string;
    fromAddress: string;
    value: number;
    time: string;
  }[];
  priceHistory?: {
    date: number;
    price: number;
  }[];
}
const ChatbotPage : React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "What is this token about?",
    "Explain the tokenomics of this token",
    "What's the price trend for this token?",
    "Recent performance of this token",
  ];

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/token?token=${token}`);
        const data = await response.json();
        console.log("the data we recieved is: ", data);
        const tokenInfo = data[0]?.metadata?.data;
        
        if (tokenInfo) {
          setTokenData({
            address: tokenInfo.address,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            icon: tokenInfo.icon,
            price: tokenInfo.price,
            marketCap: tokenInfo.market_cap,
            supply: tokenInfo.supply,
            priceChange24h: tokenInfo.price_change_24h,
            volume24h: tokenInfo.volume_24h,
            creator: tokenInfo.creator,
            createdTime: tokenInfo.created_time,
            description: tokenInfo.metadata?.description,
            image: tokenInfo.metadata?.image,
            activities: data[0]?.activities?.map((activity: any) => ({
              activityType: activity.activity_type,
              fromAddress: activity.from_address,
              value: activity.value,
              time: activity.time,
            })),
            priceHistory: data[0]?.prices?.data?.map((price: any) => ({
              date: price.date,
              price: price.price,
            })),
          });
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setMessages(prev => [...prev, { content: inputMessage, isUser: true }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          tokenData: {
            name: tokenData?.name,
            symbol: tokenData?.symbol,
            price: tokenData?.price,
            marketCap: tokenData?.marketCap,
            supply: tokenData?.supply,
            priceChange24h: tokenData?.priceChange24h,
            volume24h: tokenData?.volume24h,
          }
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.reply, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        content: "Sorry, I'm having trouble connecting. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#161616] text-white">
      <header className="p-4 border-b border-[#2F3548]">
        <div className="max-w-4xl flex items-center gap-4">
          <Image
            src={imgRobot}
            alt="Typhon Bot"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Chat with Typhon Bot</h1>
            <p className="text-sm text-gray-400">
              Get detailed insights about {tokenData?.name || "this token"}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center mt-20">
            <Image
              src={imgRobot}
              alt="Typhon Bot"
              width={120}
              height={120}
              className="mx-auto mb-6 rounded-full"
            />
            <h2 className="text-2xl font-bold mb-4">Typhon AI Assistant</h2>
            <p className="text-gray-400 mb-8">
              Ask me anything about {tokenData?.name || "this token"}. I can analyze price trends, 
              tokenomics, and recent market activity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="p-3 text-left rounded-lg bg-[#1A1F2C] hover:bg-[#2F3548] transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${msg.isUser ? "bg-[#2F3548] rounded-br-none" : "bg-[#1A1F2C] rounded-bl-none"}`}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-lg bg-[#1A1F2C]">
                  <BeatLoader color="#5EE616" size={8} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#2F3548]">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about this token..."
            className="flex-1 p-3 rounded-lg bg-[#1A1F2C] focus:outline-none focus:ring-2 focus:ring-[#4d9dcb]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 text-left rounded-lg bg-[black] hover:bg-[#4d9dcb] transition-colors border-2 border-[white]"
            disabled={isLoading}
          >
            <SendHorizonal className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotPage ;