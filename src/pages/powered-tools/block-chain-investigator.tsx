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

// --- Define Data Models ---
interface OnChainActivity {
  id: number;
  type: string;
  amount: string;
  token: string;
  timestamp: string;
  wallet: string;
}

interface FraudAlert {
  id: number;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface TimelineEvent {
  id: number;
  event: string;
  timestamp: string;
  details: string;
}

// --- Dummy Data ---
const dummyOnChainActivity: OnChainActivity[] = [
  {
    id: 1,
    type: 'Transfer',
    amount: '2 ETH',
    token: 'ETH',
    timestamp: '2025-02-23 12:45',
    wallet: '0xABC...123',
  },
  {
    id: 2,
    type: 'Swap',
    amount: '500 USDC',
    token: 'USDC',
    timestamp: '2025-02-23 13:00',
    wallet: '0xDEF...456',
  },
  {
    id: 3,
    type: 'Mint',
    amount: '1000 TOKEN',
    token: 'TOKEN',
    timestamp: '2025-02-23 13:15',
    wallet: '0xGHI...789',
  },
];

const dummyFraudAlerts: FraudAlert[] = [
  {
    id: 1,
    description: 'Multiple failed transactions detected.',
    riskLevel: 'high',
    timestamp: '2025-02-23 12:50',
  },
  {
    id: 2,
    description: 'Unusual transaction volume from unknown wallet.',
    riskLevel: 'medium',
    timestamp: '2025-02-23 13:05',
  },
];

const dummyTimelineEvents: TimelineEvent[] = [
  {
    id: 1,
    event: 'Suspicious login attempt',
    timestamp: '2025-02-23 12:40',
    details: 'Multiple login attempts from different IP addresses.',
  },
  {
    id: 2,
    event: 'Large withdrawal',
    timestamp: '2025-02-23 13:10',
    details: 'Withdrawal of 5 ETH from a rarely used wallet.',
  },
  {
    id: 3,
    event: 'Smart contract interaction flagged',
    timestamp: '2025-02-23 13:20',
    details: 'Interaction with an unverified smart contract detected.',
  },
];

const dummyAiResponse = `
**Lost/Stolen Fund Tracking and Fraud Analysis**

Our analysis indicates unusual activity in certain on-chain transactions, with high-risk alerts on multiple failed attempts and large withdrawals. Further investigation into these transactions is recommended to mitigate potential losses.
`;

const BlockchainInvestigatorPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay for shimmer effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#161616] p-8 space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white bg-clip-text text-transparent"
      >
        AI-Powered Blockchain Investigator
      </motion.h1>

      {/* On-chain Activity Tracker */}
      <Card className="border border-indigo-500/20">
        <CardHeader>
          <CardTitle className="text-indigo-400">On-chain Activity Tracker</CardTitle>
          <CardDescription>Recent on-chain transactions</CardDescription>
        </CardHeader>
        <CardContent className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyOnChainActivity.map((activity) => (
                <div key={activity.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">
                      {activity.type} - {activity.amount} {activity.token}
                    </div>
                    <div className="text-gray-400 text-sm">{activity.timestamp}</div>
                  </div>
                  <div className="text-gray-400 text-sm">Wallet: {activity.wallet}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fraud Detection Summary */}
      <Card className="border border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Fraud Detection Summary</CardTitle>
          <CardDescription>Potential fraudulent activities</CardDescription>
        </CardHeader>
        <CardContent className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyFraudAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{alert.description}</div>
                    <Badge variant="outline" className={
                      alert.riskLevel === 'high'
                        ? 'border-red-500 text-red-500'
                        : alert.riskLevel === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-green-500 text-green-500'
                    }>
                      {alert.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-gray-400 text-sm">{alert.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forensic Insights Timeline */}
      <Card className="border border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-yellow-400">Forensic Insights</CardTitle>
          <CardDescription>Timeline of suspicious events</CardDescription>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {dummyTimelineEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">{event.event}</span>
                    <span className="text-gray-400 text-sm">{event.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{event.details}</p>
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
          <CardDescription>Lost/stolen fund tracking and fraud analysis</CardDescription>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
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

export default BlockchainInvestigatorPage;

 