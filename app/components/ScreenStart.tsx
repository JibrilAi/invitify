"use client";

import { config } from "@/lib/config";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface ScreenStartProps {
  onFinish?: () => void;
}

const ScreenStart = ({ onFinish }: ScreenStartProps) => {
  const [text, setText] = useState("");
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [visible, setVisible] = useState(true);

  const fullText = `THE WEDDING OF ${config.coupleNames.toUpperCase()}`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        // Automatically begin fade out after brief pause
        setTimeout(() => {
          setFadeClass("opacity-0 pointer-events-none");
          setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
          }, 600);
        }, 1200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [fullText, onFinish]);

  const handleSkip = () => {
    setFadeClass("opacity-0 pointer-events-none");
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 300);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-[#0a0a0a] text-white flex flex-col justify-center items-center cursor-pointer transition-opacity duration-700 ${fadeClass}`}
    >
      <div className="text-center px-6 max-w-lg">
        <p className="font-legan text-xs sm:text-sm tracking-[5px] text-white/60 uppercase mb-3 animate-pulse">
          Exclusive Invitation
        </p>
        <h1 className="font-ovo text-2xl sm:text-4xl uppercase tracking-widest min-h-[3.5rem] text-white leading-relaxed">
          {text}
          <span className="inline-block w-0.5 h-6 sm:h-8 ml-1.5 bg-white animate-ping" />
        </h1>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="mt-8 flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-legan text-white tracking-wider uppercase transition shadow-lg backdrop-blur-sm"
      >
        <span>Enter Invitation</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ScreenStart;
