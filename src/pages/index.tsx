import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { useRef, useState } from "react";
import type * as THREE from "three";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import PrivyModal from "@/components/privy-model"; // Your separate modal component

// --- Images (replace with your actual paths)
import imgLogo from "/public/images/logo.png";
import imgTwitter from "/public/images/socials/twitter.png";
import imgDiscord from "/public/images/socials/discord.png";
import imgDocument from "/public/images/socials/document.png";
import imgGithub from "/public/images/socials/github.png";
import imgHelp from "/public/images/socials/help.png";
import imgTelegram from "/public/images/socials/telegram.png";
import imgSolana from "/public/images/socials/solana.png";

// --- 3D Model
const RotatingModel = () => {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/model.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.2} />;
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    /** 
     * Use min-h-screen + overflow-y-auto + .no-scrollbar 
     * to allow scrolling while hiding the scrollbar.
     */
    <div className="min-h-screen bg-black overflow-y-auto no-scrollbar relative">
      {/* Fixed top-right button */}
      <div className="fixed right-8 top-8 z-50">
        <Button
          onClick={openModal}
          size="sm"
          className="w-[200px] bg-[#161616] text-white border-2 border-white"
        >
          Get Started
        </Button>
      </div>

      {/* Page Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          {/* Title & Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl mr-4">
                Welcome to
              </span>
              <Image src={imgLogo} alt="Typhon Logo" width={220} height={300} />
            </div>
            <h1 className="py-4 max-w-3xl mx-auto text-[20px] font-bold text-white">
              Typhon is an advanced AI-driven crypto suite that interacts with tokens like a human,
              providing real-time insights, predicting market trends, and optimizing your investments.
              Explore portfolio management, security scanning, blockchain investigation, tokenomics
              optimization, NFT & gaming strategies, and more.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative h-[260px] w-full max-w-3xl mx-auto rounded-lg shadow-lg my-8"
          >
            <div className="absolute inset-0">
              <Canvas camera={{ position: [2, 2, 5] }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[2, 1.5, 0.5]} />
                <RotatingModel />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="w-full max-w-3xl mx-auto flex flex-wrap justify-center gap-6 py-4"
          >
            {[
              { src: imgTwitter, label: "X" },
              { src: imgDiscord, label: "Discord" },
              { src: imgTelegram, label: "Telegram" },
              { src: imgGithub, label: "Github" },
              { src: imgSolana, label: "Solana" },
              { src: imgHelp, label: "Help" },
              { src: imgDocument, label: "Docs" },
            ].map((social, idx) => (
              <div key={idx} className="text-center">
                <a href="#">
                  <Image src={social.src} alt={social.label} width={50} height={50} />
                  <h2 className="text-white text-sm mt-1">{social.label}</h2>
                </a>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="h-32" />
      </div>

      {showModal && <PrivyModal onClose={closeModal} />}
    </div>
  );
}