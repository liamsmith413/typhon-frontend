// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import React, { useRef, useState } from "react";
// import type * as THREE from "three";
// import Image from "next/image";
// import { motion } from "framer-motion";

// import { Button } from "@/components/ui/button";
// import PrivyModal from "@/components/privy-model"; // Your separate modal component

// // --- Images (replace with your actual paths)
// import imgLogo from "/public/images/logo.png";
// import imgTwitter from "/public/images/socials/twitter.png";
// import imgDiscord from "/public/images/socials/discord.png";
// import imgDocument from "/public/images/socials/document.png";
// import imgGithub from "/public/images/socials/github.png";
// import imgHelp from "/public/images/socials/help.png";
// import imgTelegram from "/public/images/socials/telegram.png";
// import imgSolana from "/public/images/socials/solana.png";

// // --- 3D Model
// const RotatingModel = () => {
//   const modelRef = useRef<THREE.Group>(null);
//   const { scene } = useGLTF("/model.glb");

//   useFrame(() => {
//     if (modelRef.current) {
//       modelRef.current.rotation.y += 0.01;
//     }
//   });

//   return <primitive ref={modelRef} object={scene} scale={0.2} />;
// };

// export default function Home() {
//   const [showModal, setShowModal] = useState(false);

//   const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     setShowModal(true);
//   };

//   const closeModal = () => setShowModal(false);

//   return (
//     /** 
//      * Use min-h-screen + overflow-y-auto + .no-scrollbar 
//      * to allow scrolling while hiding the scrollbar.
//      */
//     <div className="min-h-screen bg-black overflow-y-auto no-scrollbar relative">
//       {/* Fixed top-right button */}
//       <div className="fixed right-8 top-8 z-50">
//         <Button
//           onClick={openModal}
//           size="sm"
//           className="w-[200px] bg-[#161616] text-white border-2 border-white"
//         >
//           Get Started
//         </Button>
//       </div>

//       {/* Page Content */}
//       <div className="pt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
//           {/* Title & Logo */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             className="flex flex-col items-center"
//           >
//             <div className="flex items-center justify-center mb-4">
//               <span className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl mr-4">
//                 Welcome to
//               </span>
//               <Image src={imgLogo} alt="Typhon Logo" width={220} height={300} />
//             </div>
//             <h1 className="py-4 max-w-3xl mx-auto text-[20px] font-bold text-white">
//               Typhon is an advanced AI-driven crypto suite that interacts with tokens like a human,
//               providing real-time insights, predicting market trends, and optimizing your investments.
//               Explore portfolio management, security scanning, blockchain investigation, tokenomics
//               optimization, NFT & gaming strategies, and more.
//             </h1>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5, duration: 1 }}
//             className="relative h-[180px] w-full max-w-3xl mx-auto rounded-lg shadow-lg my-8"
//           >
//             <div className="absolute inset-0">
//               <Canvas camera={{ position: [2, 2, 5] }}>
//                 <ambientLight intensity={0.9} />
//                 <directionalLight position={[2, 1.5, 0.5]} />
//                 <RotatingModel />
//                 <OrbitControls enableZoom={false} />
//               </Canvas>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1, duration: 1 }}
//             className="w-full max-w-3xl mx-auto flex flex-wrap justify-center gap-6 py-4"
//           >
//             {[
//               { src: imgTwitter, label: "X" },
//               { src: imgDiscord, label: "Discord" },
//               { src: imgTelegram, label: "Telegram" },
//               { src: imgGithub, label: "Github" },
//               { src: imgSolana, label: "Solana" },
//               { src: imgHelp, label: "Help" },
//               { src: imgDocument, label: "Docs" },
//             ].map((social, idx) => (
//               <div key={idx} className="text-center">
//                 <a href="#">
//                   <Image src={social.src} alt={social.label} width={50} height={50} />
//                   <h2 className="text-white text-sm mt-1">{social.label}</h2>
//                 </a>
//               </div>
//             ))}
//           </motion.div>
//         </div>

//         <div className="h-32" />
//       </div>

//       {showModal && <PrivyModal onClose={closeModal} />}
//     </div>
//   );
// }

import React from "react";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";

import Image from 'next/image';
import imgTyphonToken from '/public/images/typhon_token.png';
import imgCopy from '/public/images/copy.png';

const Home = () => {
  
  return (
    <div className="flex h-full flex-col bg-[#161616]">
      <div className="flex-1 space-y-4 p-8 pt-6">
       
        <div className="w-full">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 ...">
              <div className="w-full flex items-align align-items">
                <Image src={imgTyphonToken} alt="mytoken" width={100} height={100} />
                <div className="">
                  <h2 className="text-3xl font-bold tracking-tight mb-3">Typhon</h2>
                  <hr />
                  <div className="flex p-2">
                    <span className="text-1xl">4MpXgiYj9nEvN1xZYZ4qgB6zq5r2JMRy54WaQu5fpump</span>&nbsp;<span><Image src={imgCopy} alt="copy" width={20} height={20} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">
              Jupiter
            </TabsTrigger>
            <TabsTrigger value="reports">
              Moby
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Block
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Price
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00307</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    MarketCap
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3.03M</div>
                  <p className="text-xs text-muted-foreground">
                    +183 from last hour
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Holders</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$363.24K</div>
                  <p className="text-xs text-muted-foreground">
                    +2424 from last hour
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Supply
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">999.99M</div>
                  <p className="text-xs text-muted-foreground">
                    +2392 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                  <CardDescription>
                    There are 232+ transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
