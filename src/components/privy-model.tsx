import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import privyLogo from "../../public/images/robot.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRef as reactUseRef } from 'react';

const firebaseConfig = {   }; // i want your firebase config here
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface PrivyModalProps {
  onClose: () => void;
}

const OtpHolder: React.FC<{ 
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}> = ({ email, onVerify, onResend }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputs = reactUseRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.every(num => num)) onVerify(newOtp.join(""));
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-6">
        {otp.map((_, i) => (
          <input
            key={i}
            ref={el => { if (el) inputs.current[i] = el }}
            type="text"
            maxLength={1}
            value={otp[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            className="w-12 h-12 text-2xl text-center bg-gray-800 rounded-md focus:ring-2 focus:ring-indigo-600"
          />
        ))}
      </div>
      <div className="text-sm text-gray-400">
        Didn't receive code?{" "}
        <button onClick={onResend} className="text-indigo-400 hover:text-indigo-300">
          Resend code
        </button>
      </div>
    </div>
  );
};

const PrivyModal: React.FC<PrivyModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [view, setView] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/user/signin', { email });
      toast.success('OTP sent successfully!');
      setView("otp");
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const { data } = await axios.post('http://localhost:5000/user/verify-otp', {
        email,
        otp
      });
      
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home';
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

//   const handleGoogleSignIn = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       const { data } = await axios.post('http://localhost:5000/user/google-signin', {
//         email: user.email,
//         name: user.displayName,
//         photoURL: user.photoURL,
//         uid: user.uid
//       });

//       if (data.status === 'success') {
//         localStorage.setItem('user', JSON.stringify(data.user));
//         window.location.href = '/';
//       }
//     } catch (error) {
//       toast.error('Google sign-in failed. Please try again.');
//     }
//   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#161616] p-6 rounded-xl shadow-xl w-full max-w-sm mx-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
          aria-label="Close Modal"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="w-14 h-14 mb-2">
            <Image
              src={privyLogo}
              alt="Privy Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            {view === "email" ? "Log in or Sign up" : "Enter confirmation code"}
          </h2>
        </div>

        {view === "email" ? (
          <>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  onClick={handleSendOtp}
                  disabled={!isEmailValid || loading}
                  className="absolute right-1   px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Submit'}
                </Button>
              </div>
            </div>

            <Button
              className="bg-white hover:bg-gray-200 w-full mb-3 flex items-center justify-center gap-2 text-black"
            //   onClick={handleGoogleSignIn}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 533.5 544.3"
                aria-hidden="true"
              >
                <path fill="#4285f4" d="M533.5 278.4c0-15.7-1.4-31.2-4.1-46.4H272.1v87.8h146.9c-6.4 34.5-25 63.7-53.1 83.1v68.9h85.9c50 45.9 78.7 113.7 78.7 188.7z" />
                <path fill="#34a853" d="M272.1 544.3c71.8 0 132-23.7 176.1-64.3l-85.9-68.9c-23.2 15.6-53 24.9-90.2 24.9-69 0-127.5-46.6-148.5-109.3h-89.5v68.1c44.4 87 135.3 149.5 237.9 149.5z" />
                <path fill="#fbbc04" d="M123.6 326.7c-10.2-30.5-10.2-63.1 0-93.6v-68.1h-89.5c-37.8 73.8-37.8 156 0 229.8l89.5-68.1z" />
                <path fill="#ea4335" d="M272.1 214.6c37.3 0 71 12.9 97.5 38.3l73-73c-45.8-42.7-104.4-66.2-170.5-66.2-102.6 0-193.5 62.6-237.9 149.5l89.5 68.1c21.1-62.7 79.6-109.3 148.5-109.3z" />
              </svg>
              Continue with Google
            </Button>
            <div className="flex gap-2 mb-3">
              <Button className="flex-1 bg-gray-700 text-white hover:bg-gray-600">
                Phantom
              </Button>
              <Button className="flex-1 bg-gray-700 text-white hover:bg-gray-600">
                Solana
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <Image
                src={privyLogo}
                alt="Email Icon"
                width={48}
                height={48}
                className="mx-auto mb-4"
              />
              <p className="text-gray-400">
                Please check {email} for an email from typhon
              </p>
            </div>
            
            <OtpHolder
              email={email}
              onVerify={handleVerifyOtp}
              onResend={handleSendOtp}
            />
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full border-gray-600 text-gray-300 mb-4 hover:bg-gray-800"
        >
          More options
        </Button>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Protected by Privy</span>
          <span className="text-gray-600">•</span>
          <span>All rights reserved</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivyModal;

