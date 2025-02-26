import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import roboImage from "../../public/images/robot.png";
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  name: string;
  email: string;
  _id: string;
  avatar?: string;
  joinedAt: string;
  portfolioValue: number;
  portfolioChange: number;
  securityLevel: number;
  wallets: string[];
  transactions: Transaction[];
  isProMember: boolean;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'deposit';
  amount: string;
  asset: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [security2FA, setSecurity2FA] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
 
   
  const dummyUser: User = {
    name: "Darko",
    email: "darko@web3.com",
    _id: "0x892...1d4",
    avatar: roboImage.src,
    joinedAt: "2023-01-15",
    portfolioValue: 184230.75,
    portfolioChange: 2.3,
    securityLevel: 85,
    wallets: ["0x892...1d4", "0x4a3...8b2"],
    isProMember: true,
    transactions: [
      { id: "TX1", type: 'buy', amount: "1.5 ETH", asset: "ETH", date: "2024-03-20", status: 'completed' },
      { id: "TX2", type: 'swap', amount: "500 USDC", asset: "SOL", date: "2024-03-19", status: 'pending' },
      { id: "TX3", type: 'sell', amount: "0.5 BTC", asset: "BTC", date: "2024-03-18", status: 'completed' },
    ]
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          const response = await axios.get(`http://localhost:5000/user/details/${parsedUser._id}`);
          
          if (response.data.status === 'success') {
            const apiUser = response.data.data;
            const mergedUser = {
              ...dummyUser,
              name: apiUser.name || dummyUser.name,
              email: apiUser.email || dummyUser.email,
              _id: parsedUser._id,
              avatar: apiUser.avatar || dummyUser.avatar,
            };
            setUser(mergedUser);
          } else {
            setUser(dummyUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user details");
          setUser(dummyUser);
        }
      } else {
        setUser(dummyUser);
      }
      
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-red-500/20 text-red-500';
    }
  };
  const handleConfirmLogout = () => {
    localStorage.removeItem('user');
    window.location.replace('/home');  
  };

  return (
    <div className="min-h-screen bg-[#161616] via-blue-900/20 to-gray-900 text-white p-8 overflow-y-auto">
       {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm Logout</h3>
              <p className="text-gray-400">Are you sure you want to log out of your account?</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmLogout}
              >
                Confirm Logout
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={dummyUser.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              {user?.isProMember && (
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600">
                  PRO
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent">
                {user?.name}
              </h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </motion.div>
          
          <Button 
            onClick={() => {}} 
            className="bg-black text-white border-2 border-white hover:from-purple-700 hover:to-blue-700"
          >
            Upgrade to Pro
          </Button>
        </div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border border-purple-500/20 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-purple-400">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${user?.portfolioValue.toLocaleString()}
              </div>
              <div className={`text-sm ${(user?.portfolioChange ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {user?.portfolioChange}% (24h)
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-500/20 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-blue-400">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={user?.securityLevel} className="h-2 bg-gray-700" />
              <div className="mt-2 text-sm text-gray-400">
                {user?.securityLevel}/100 points
              </div>
            </CardContent>
          </Card>

          <Card className="border border-pink-500/20 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-pink-400">Assets</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-gray-400">Tokens Held</div>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-gray-400">Wallets</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-blue-500/20 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-blue-400">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <div className="font-medium">{tx.type.toUpperCase()}</div>
                        <div className="text-sm text-gray-400">{tx.asset}</div>
                      </div>
                      <div className="text-right">
                        <div className={getStatusColor(tx.status)}>
                          {tx.status}
                        </div>
                        <div className="text-sm text-gray-400">{tx.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-500/20 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-purple-400">Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Portfolio Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-green-500/20 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-green-400">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>2FA Authentication</span>
                  <Switch checked={security2FA} onCheckedChange={setSecurity2FA} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-medium mb-2">Connected Wallets</h3>
                  {user?.wallets.map((wallet, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-400">{wallet}</span>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10">
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-yellow-500/20 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-gray-400">Chrome • MacOS</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-500/10"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 border-t border-gray-700/50"
        >
          <Button 
            onClick={() => {}} 
            variant="ghost" 
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Delete Account
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountPage;