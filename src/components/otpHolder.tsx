import { useState, useRef, useEffect } from "react";

interface OtpHolderProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

const OtpHolder: React.FC<OtpHolderProps> = ({ email, onVerify, onResend }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(num => num)) {
      onVerify(newOtp.join(""));
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-6">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e.target.value, index)}
            ref={el => { if (el) inputs.current[index] = el }}
            className="w-12 h-12 text-2xl text-center bg-gray-800 rounded-md focus:ring-2 focus:ring-indigo-600"
          />
        ))}
      </div>
      <div className="text-sm text-gray-400">
        Didn't receive code?{" "}
        <button
          onClick={onResend}
          className="text-indigo-400 hover:text-indigo-300"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};