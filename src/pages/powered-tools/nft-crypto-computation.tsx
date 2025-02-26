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
import { Badge } from '@/components/ui/badge';
import robo from "../../../public/images/robot.png";

interface NFTDeal {
  id: number;
  imageUrl: string;
  name: string;
  price: string;
  discount: string;
}

interface NFTMint {
  id: number;
  imageUrl: string;
  name: string;
  predictedRarity: number;  
  description: string;
}

interface GamingStrategy {
  id: number;
  title: string;
  details: string;
}

const dummyNFTDeals: NFTDeal[] = [
  {
    id: 1,
    imageUrl: robo.src,  
    name: 'CryptoPunk #1234',
    price: '8 ETH',
    discount: '10% off',
  },
  {
    id: 2,
    imageUrl: robo.src,
    name: 'Bored Ape #5678',
    price: '15 ETH',
    discount: '5% off',
  },
];

const dummyNFTMints: NFTMint[] = [
  {
    id: 1,
    imageUrl: robo.src,
    name: 'Mystery Mint #001',
    predictedRarity: 92,
    description: 'High rarity predicted based on current trends.',
  },
  {
    id: 2,
    imageUrl: robo.src,
    name: 'Mystery Mint #002',
    predictedRarity: 75,
    description: 'Average rarity with potential for improvement.',
  },
];

const dummyGamingStrategies: GamingStrategy[] = [
  {
    id: 1,
    title: 'Focus on Daily Challenges',
    details: 'Completing daily missions yields consistent rewards and bonus tokens.',
  },
  {
    id: 2,
    title: 'Join Guilds or Clans',
    details: 'Collaboration in guilds can unlock exclusive rewards and power-ups.',
  },
  {
    id: 3,
    title: 'Participate in Special Events',
    details: 'Keep an eye on seasonal events to maximize your crypto rewards.',
  },
];

const dummyAiResponse = `
**AI Analysis: NFT & Gaming Companion**

Our AI suggests that the best NFT deals are trending on multiple marketplaces.
The rarity prediction indicates that mint #001 is highly coveted.
For gaming, focusing on daily challenges and community events can maximize crypto rewards.
`;

const NFTGamingCompanionPage = () => {
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
        className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
      >
        AI-Powered NFT & Crypto Gaming Companion
      </motion.h1>

      <Card className="border border-teal-500/20">
        <CardHeader>
          <CardTitle className="text-teal-400">NFT Deals Tracker</CardTitle>
          <CardDescription>Find the best NFT deals across marketplaces</CardDescription>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyNFTDeals.map((deal) => (
                <div key={deal.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img src={deal.imageUrl} alt={deal.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{deal.name}</div>
                    <div className="text-gray-400 text-sm">{deal.price} • {deal.discount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-indigo-500/20">
        <CardHeader>
          <CardTitle className="text-indigo-400">NFT Mint Rarity Predictor</CardTitle>
          <CardDescription>Get rarity predictions for upcoming NFT mints</CardDescription>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyNFTMints.map((mint) => (
                <div key={mint.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img src={mint.imageUrl} alt={mint.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{mint.name}</div>
                    <div className="text-gray-400 text-sm">{mint.description}</div>
                  </div>
                  <Badge variant="outline" className="border-purple-500 text-purple-500">
                    {mint.predictedRarity}% Rarity
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-orange-500/20">
        <CardHeader>
          <CardTitle className="text-orange-400">Gaming Strategy Suggestions</CardTitle>
          <CardDescription>Best strategies to earn crypto rewards in P2E games</CardDescription>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyGamingStrategies.map((strategy) => (
                <div key={strategy.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="text-white font-medium">{strategy.title}</div>
                  <p className="text-gray-400 text-sm">{strategy.details}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Response Section */}
      <Card className="border border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-emerald-400">AI Response</CardTitle>
          <CardDescription>
            Analysis on NFT deals, rarity predictions, and gaming strategies
          </CardDescription>
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

export default NFTGamingCompanionPage;
