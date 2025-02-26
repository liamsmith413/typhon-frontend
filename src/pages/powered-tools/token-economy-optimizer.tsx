import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const dummyTokenomics = {
  totalSupply: "1,000,000",
  circulatingSupply: "750,000",
  stakingAmount: "500,000",
  liquidityPool: "250,000",
};

const optimizationSuggestions = [
  { id: 1, suggestion: "Increase Staking Rewards", details: "Adjust reward percentages and consider bonus multipliers during promotional phases." },
  { id: 2, suggestion: "Enhance Liquidity", details: "Integrate with additional DEX platforms and introduce auto-liquidity features." },
  { id: 3, suggestion: "Implement Token Burn", details: "Burn a portion of tokens on each transaction to reduce supply over time." },
];

const dummyAiResponse = `
**AI Analysis: Token Economy Optimization**

Our analysis suggests that refining the tokenomics model could drive higher demand. Focus on boosting staking incentives, optimizing liquidity allocation, and instituting periodic token burns to stabilize value.
`;

const TokenEconomyOptimizerPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#161616] p-8 space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
      >
        AI-Based Token Economy Optimizer
      </motion.h1>

      <Card className="border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Tokenomics Summary</CardTitle>
          <CardDescription>Overview of supply, staking, and liquidity</CardDescription>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/4" />
              <Skeleton className="h-6 w-4/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>Total Supply:</span>
                <span>{dummyTokenomics.totalSupply}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Circulating Supply:</span>
                <span>{dummyTokenomics.circulatingSupply}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Staking Amount:</span>
                <span>{dummyTokenomics.stakingAmount}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Liquidity Pool:</span>
                <span>{dummyTokenomics.liquidityPool}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-400">Optimization Suggestions</CardTitle>
          <CardDescription>Recommendations for enhancing token economics</CardDescription>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <Table className="w-full">
              <TableBody>
                {optimizationSuggestions.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-800/50">
                    <TableCell className="text-white font-medium">{item.suggestion}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{item.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-emerald-400">AI Response</CardTitle>
          <CardDescription>Supply models, staking structures, and liquidity improvements</CardDescription>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/4" />
            </div>
          ) : (
            <div className="prose prose-invert">
              {dummyAiResponse}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenEconomyOptimizerPage;
