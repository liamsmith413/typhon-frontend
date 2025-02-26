import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenData {
  address: string;
  symbol: string;
  supply: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  icon?: string;
  priceHistory?: { date: string; price: number; }[];
}

const formatNumber = (num: number) => 
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);

const PortfolioSummary = ({ tokens }: { tokens: TokenData[] }) => {
  const totalValue = tokens.reduce((sum, t) => sum + t.marketCap, 0);
  const portfolioChange = tokens.reduce((sum, t) => sum + (t.priceChange24h * t.marketCap), 0) / totalValue;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <span className="text-xs text-muted-foreground">USD</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${formatNumber(totalValue)}</div>
          <div className={`text-sm ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioChange.toFixed(2)}% (24h)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Asset</CardTitle>
          <span className="text-xs text-muted-foreground">
            {tokens[0]?.symbol || 'N/A'}
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((tokens[0]?.marketCap ?? 0) / totalValue * 100).toFixed(1)}%
          </div>
          <div className="text-sm">Market Dominance</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          <span className="text-xs text-muted-foreground">Volatility</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Medium</div>
          <Progress value={Math.abs(portfolioChange) * 10} className="h-2 bg-red-100" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
          <span className="text-xs text-muted-foreground">Count</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tokens.length}</div>
          <div className="text-sm">Tracked Tokens</div>
        </CardContent>
      </Card>
    </div>
  );
};

const MarketTrends = ({ tokens }: { tokens: TokenData[] }) => {
  const priceData = tokens
    .filter(t => t.priceHistory?.length)
    .flatMap(t => 
      t.priceHistory?.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        price: entry.price,
        symbol: t.symbol
      })) || []
    );

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
        <CardDescription>Historical price data</CardDescription>
      </CardHeader>
      <CardContent>
        {priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#82ca9d"
                strokeWidth={2}
              />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No historical data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AssetAllocation = ({ tokens }: { tokens: TokenData[] }) => {
  const topAssets = tokens
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 5)
    .map(token => ({
      symbol: token.symbol,
      percentage: (token.marketCap / tokens.reduce((sum, t) => sum + t.marketCap, 0)) * 100
    }));

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Top 5 holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topAssets}>
            <Bar 
              dataKey="percentage" 
              fill="#8884d8" 
              label={{ position: 'top', fill: '#fff' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const RiskAnalysis = ({ tokens }: { tokens: TokenData[] }) => {
  const highRisk = tokens.filter(t => Math.abs(t.priceChange24h) > 15);
  const mediumRisk = tokens.filter(t => Math.abs(t.priceChange24h) > 5 && Math.abs(t.priceChange24h) <= 15);

  return (
    <Card className="h-[350px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Risk Exposure</CardTitle>
        <CardDescription>Volatility analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">High Risk Assets ({highRisk.length})</span>
            <Badge variant="destructive">+{highRisk.length}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {highRisk.slice(0, 4).map(token => (
              <div key={token.address} className="flex items-center space-x-2">
                <span className="text-sm">{token.symbol}</span>
                <span className={`text-sm ${token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Medium Risk ({mediumRisk.length})</span>
            <Badge variant="secondary">+{mediumRisk.length}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mediumRisk.slice(0, 4).map(token => (
              <div key={token.address} className="flex items-center space-x-2">
                <span className="text-sm">{token.symbol}</span>
                <span className={`text-sm ${token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatResponse = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/\|(.*)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<table class="w-full"><tr>${cells}</tr></table>`;
    });
};

const PortfolioManagerPage = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensRes, aiRes] = await Promise.all([
          fetch('http://localhost:5000/api/solscan-tokens?limit=2'),
          fetch('/api/ai-analysis?type=portfolio')
        ]);

        const tokensData = await tokensRes.json();
        const processedTokens = tokensData.solscanTokens.map((token: any) => ({
          ...token,
          marketCap: parseFloat(token.market_cap.replace(/,/g, '')),
          price: parseFloat(token.price),
          priceChange24h: 0 
        }));
        
        setTokens(processedTokens);

        const aiData = await aiRes.json();
        setAiResponse(aiData.reply);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-[#161616] p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[350px] col-span-4" />
          <Skeleton className="h-[350px] col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#161616] p-8 space-y-6 overflow-auto">
      <h1 className="text-3xl font-bold   top-0 bg-[#161616] py-4 z-10">
        AI Portfolio Manager
      </h1>
      
      <div className="space-y-6 flex-1">
        <PortfolioSummary tokens={tokens} />
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4 space-y-6">
            <MarketTrends tokens={tokens} />
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <AssetAllocation tokens={tokens} />
              <RiskAnalysis tokens={tokens} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="min-h-[500px]">
              <CardHeader className="  top-0 bg-card z-10">
                <CardTitle>AI Portfolio Analysis</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div 
                  className="overflow-y-auto max-h-[600px]"
                  dangerouslySetInnerHTML={{ __html: formatResponse(aiResponse) }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
</div>
  );
};

export default PortfolioManagerPage;