import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- Dummy Data ---
const sampleCode = `pragma solidity ^0.8.0;

contract SampleToken {
    mapping(address => uint256) public balanceOf;

    function transfer(address recipient, uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
    }
}`;

interface Vulnerability {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

const vulnerabilities: Vulnerability[] = [
  {
    id: 1,
    title: "Reentrancy Vulnerability",
    severity: "critical",
    description: "The contract allows reentrancy which can lead to unexpected withdrawals."
  },
  {
    id: 2,
    title: "Integer Overflow",
    severity: "high",
    description: "Arithmetic operations could lead to overflows causing security issues."
  }
];

interface Improvement {
  id: number;
  title: string;
  codeSnippet: string;
  explanation: string;
}

const improvements: Improvement[] = [
  {
    id: 1,
    title: "Implement Reentrancy Guard",
    codeSnippet: "import '@openzeppelin/contracts/security/ReentrancyGuard.sol';\n\ncontract SampleToken is ReentrancyGuard { ... }",
    explanation: "Using a reentrancy guard prevents multiple calls to vulnerable functions."
  },
  {
    id: 2,
    title: "Use SafeMath Library",
    codeSnippet: "using SafeMath for uint256;\n\nbalanceOf[msg.sender] = balanceOf[msg.sender].sub(amount);",
    explanation: "SafeMath helps avoid integer overflows and underflows."
  }
];

const aiResponse = `
**AI Security Analysis and Best Practices**

1. The contract is vulnerable to reentrancy attacks. Implement a reentrancy guard.
2. Use SafeMath or built-in overflow checks to protect against arithmetic vulnerabilities.
3. Apply best practices for access control and validate inputs carefully.
`;

const SmartContractAuditorPage = () => {
  // In the future, fetch dynamic data from the backend here.
  // Example:
  // const [data, setData] = useState(null);
  // useEffect(() => { fetch('/api/auditor').then(...); }, []);

  return (
    <div className="min-h-screen bg-[#161616] p-8 space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
      >
        AI-Powered Smart Contract Auditor
      </motion.h1>

      {/* Smart Contract Code Viewer */}
      <Card className="border border-indigo-500/20">
        <CardHeader>
          <CardTitle className="text-indigo-400">Smart Contract Code</CardTitle>
          <CardDescription>View the audited contract code</CardDescription>
        </CardHeader>
        <CardContent className="max-h-72 overflow-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700">
          <pre className="text-sm font-mono text-white whitespace-pre-wrap">
            {sampleCode}
          </pre>
        </CardContent>
      </Card>

      {/* Grid for Vulnerability List and Suggested Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability List */}
        <Card className="border border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Vulnerability List</CardTitle>
            <CardDescription>Detected issues in the contract</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-700 space-y-4">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{vuln.title}</span>
                  <Badge variant="outline" className={
                    vuln.severity === 'critical' ? 'border-red-500 text-red-500' :
                    vuln.severity === 'high' ? 'border-orange-500 text-orange-500' :
                    vuln.severity === 'medium' ? 'border-yellow-500 text-yellow-500' :
                    'border-green-500 text-green-500'
                  }>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mt-2">{vuln.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Improvements */}
        <Card className="border border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400">Suggested Improvements</CardTitle>
            <CardDescription>Recommended fixes and optimizations</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700 space-y-4">
            {improvements.map((improve) => (
              <div key={improve.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{improve.title}</span>
                </div>
                <pre className="text-sm font-mono text-gray-200 mt-2 bg-gray-900 p-2 rounded whitespace-pre-wrap">
                  {improve.codeSnippet}
                </pre>
                <p className="text-gray-400 text-sm mt-2">{improve.explanation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Response Section */}
      <Card className="border border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-emerald-400">AI Response</CardTitle>
          <CardDescription>Security vulnerabilities and best practices</CardDescription>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
          <div className="prose prose-invert">
            {aiResponse}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartContractAuditorPage;

