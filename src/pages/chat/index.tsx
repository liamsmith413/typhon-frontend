import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { SendHorizonal } from "lucide-react";
import { BeatLoader } from "react-spinners";
import imgRobot from '/public/images/robot.png';

interface Message {
  content: string;
  isUser: boolean;
}

interface TokenData {
  address: string;
  symbol: string;
  supply: string;
  market_cap: string;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
}

const Home: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTokensLoading, setIsTokensLoading] = useState(true);

  const predefinedQuestions = [
    "How many tokens are listed?",
    "Which token has the highest market cap?",
    "Show top 5 tokens by price performance",
    "Compare market caps of recent tokens",
  ];

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/solscan-tokens?limit=200`);
        const data = await response.json();
        console.log("data", data);

        const processedTokens = data.solscanTokens.map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          supply: token.supply,
          market_cap: token.market_cap ?
            parseFloat(String(token.market_cap).replace(/,/g, '')) : 0,
          price: token.price || 0,
          priceChange24h: token.priceChange24h || 0,
          volume24h: token.volume24h || 0
        }));

        setTokens(processedTokens);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim() || isLoading || tokens.length === 0) return;

    setMessages(prev => [...prev, { content: inputMessage, isUser: true }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/multi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          tokens: tokens
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.reply, isUser: false }]);
    } catch (error) {
      console.error("Error submitting message:", error);
      setMessages(prev => [...prev, {
        content: error instanceof Error
          ? error.message
          : "Sorry, I'm having trouble connecting. Please try again later.",
        isUser: false
      }]);
    } finally {
      setIsTokensLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[black] text-white">
      <header className="p-4 border-b border-[#2F3548]">
        <div className="max-w-4xl  flex items-center gap-4">
          <Image
            src={imgRobot}
            alt="Typhon Bot"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Multi-Token Analysis Bot</h1>
            <p className="text-sm text-gray-400">
              Analyzing {tokens.length} tokens on the platform
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
              Ask me anything about {tokens.length} listed tokens. Compare market caps,
              analyze trends, and explore token metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="p-3 text-left rounded-lg bg-[black] hover:bg-[#4d9dcb] transition-colors border-2 border-[white]"
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
                  className={`max-w-[80%] p-4 rounded-lg ${msg.isUser
                      ? "bg-[#2F3548] rounded-br-none"
                      : "bg-[#1A1F2C] rounded-bl-none"
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      ? msg.content.replace(/\n/g, '<br />')
                      : ''
                  }}
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
            placeholder="Ask about tokens..."
            className="flex-1 p-3 rounded-lg bg-[#1A1F2C] focus:outline-none focus:ring-2 focus:ring-[#4d9dcb]"
            disabled={isLoading || isTokensLoading}
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

export default Home;