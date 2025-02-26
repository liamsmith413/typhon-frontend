import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SecurityData {
  walletActivity: Activity[];
  scamTokens: ScamToken[];
  contractVulnerabilities: Vulnerability[];
}

interface Activity {
  type: string;
  amount: string;
  address: string;
  timestamp: string;
  riskLevel: 'high' | 'medium' | 'low';
}

interface ScamToken {
  symbol: string;
  address: string;
  redFlags: string[];
}

interface Vulnerability {
  contract: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

const initialSecurityData: SecurityData = {
  walletActivity: [
    { type: 'Transfer', amount: '1.5 ETH', address: '0x892...1d4', timestamp: '2024-03-20 14:30', riskLevel: 'medium' },
    { type: 'Swap', amount: '500 USDC', address: '0x4a3...8b2', timestamp: '2024-03-20 15:45', riskLevel: 'low' },
  ],
  scamTokens: [
    { symbol: 'SCAM', address: '0xscam...123', redFlags: ['Unverified contract', 'High sell tax'] },
    { symbol: 'FISHY', address: '0xfish...456', redFlags: ['No liquidity lock', 'Owner control'] },
  ],
  contractVulnerabilities: [
    { contract: 'StakingPool', severity: 'critical', description: 'Reentrancy vulnerability detected' },
    { contract: 'TokenSale', severity: 'high', description: 'Access control issues' },
  ],
};

const SecurityScannerPage = () => {
  const [securityData] = useState<SecurityData>(initialSecurityData);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setTimeout(() => {
        const analysis = `
**Security Analysis Report**

**Wallet Activity Summary:**
- 2 transactions analyzed
- Risk distribution:
  | Risk Level | Count |
  |------------|-------|
  | High       | 0     |
  | Medium     | 1     |
  | Low        | 1     |

**Scam Token Detection:**
- 2 potential scam tokens identified
- Common red flags: Unverified contracts, Owner control

**Critical Vulnerabilities:**
- Reentrancy vulnerability in StakingPool (Critical)
- Access control issues in TokenSale (High)

**Recommendations:**
1. Revoke permissions for 0xscam...123
2. Conduct comprehensive audit
3. Enable 2FA for wallet access
        `;
        setAiResponse(analysis);
        setLoading(false);
      }, 1500);
    };

    fetchAnalysis();
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500/20 text-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-green-500/20 text-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] p-8 space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
      >
        AI Security Scanner
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-blue-500/20">
            <CardHeader>
                <CardTitle className="text-blue-400">Wallet Activity</CardTitle>
                <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
                <Table className="w-full">  
                <TableBody>
                    {securityData.walletActivity.map((activity, index) => (
                    <TableRow key={index} className="hover:bg-gray-800/50">
                        <TableCell>
                        <Badge className={getRiskColor(activity.riskLevel)}>
                            {activity.riskLevel}
                        </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{activity.type}</TableCell>
                        <TableCell>{activity.amount}</TableCell>
                        <TableCell className="text-gray-400">{activity.address}</TableCell>
                        <TableCell className="text-right">{activity.timestamp}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>

            <Card className="border border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Scam Detection</CardTitle>
                <CardDescription>Potential risky tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityData.scamTokens.map((token, index) => (
                  <Alert key={index} className="border-red-500/30 bg-red-500/10">
                    <Terminal className="h-4 w-4 text-red-400" />
                    <AlertDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="font-medium">{token.symbol}</span>
                            <div className="flex flex-wrap gap-2">
                            {token.redFlags.map((flag, i) => (
                                <Badge key={i} variant="destructive">{flag}</Badge>
                            ))}
                            </div>
                        </div>
                        </AlertDescription>

                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Contract Vulnerabilities</CardTitle>
              <CardDescription>Security audit results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
              {securityData.contractVulnerabilities.map((vuln, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-lg">
                  <div className={`w-2 h-full rounded-full ${
                    vuln.severity === 'critical' ? 'bg-red-500' : 
                    vuln.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{vuln.contract}</div>
                    <div className="text-sm text-gray-400">{vuln.description}</div>
                  </div>
                  <Badge variant="outline" className={
                    vuln.severity === 'critical' ? 'border-red-500 text-red-500' : 
                    vuln.severity === 'high' ? 'border-orange-500 text-orange-500' : 'border-yellow-500 text-yellow-500'
                  }>
                    {vuln.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-emerald-500/20 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-emerald-400">AI Security Analysis</CardTitle>
            <CardDescription>Real-time threat assessment</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div 
                className="prose prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: formatResponse(aiResponse) }} 
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Market Trends & Staking Optimization</CardTitle>
          <CardDescription>Risk analysis and optimization insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Market trends indicate steady growth with emerging patterns in staking rewards optimization. Risk analysis shows moderate volatility and opportunities for yield enhancement.
          </p>
          <p className="text-gray-300">
            Stay tuned for more detailed analytics powered by real-time data and AI insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const formatResponse = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>')
    .replace(/\|(.*)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return `
        <table class="w-full my-4 border-collapse">
          <tbody>
            <tr class="border-b border-gray-700">
              ${cells.map(cell => `<td class="p-2">${cell.trim()}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      `;
    })
    .replace(/\n/g, '<br />');
};

export default SecurityScannerPage;
