'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelect = (persona: string) => {
    setIsLoading(persona);
    localStorage.setItem('deepSoul_persona', persona);
    setTimeout(() => {
      router.push(`/chat?p=${persona}`);
    }, 1500);
  };

  const options = [
    {
      id: 'insomnia',
      title: "Can't Sleep",
      desc: "Tossing and turning...",
      icon: "😴",
      color: "hover:border-amber-500/50 hover:bg-amber-500/10",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
    },
    {
      id: 'stress',
      title: "High Stress",
      desc: "Too much work...",
      icon: "😤",
      color: "hover:border-violet-500/50 hover:bg-violet-500/10",
      glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
    },
    {
      id: 'loneliness',
      title: "Feeling Lonely",
      desc: "Need someone to chat...",
      icon: "😢",
      color: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8F5F0] text-[#333333] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex flex-col items-center justify-center space-y-6" 
          > 
            <div className="relative"> 
              <div className="w-24 h-24 rounded-full border-t-2 border-[#A67C52]/20 animate-spin" /> 
              <div className="absolute inset-0 flex items-center justify-center animate-pulse"> 
                {options.find(o => o.id === isLoading)?.icon} 
              </div> 
            </div> 
            <h2 className="text-xl font-light tracking-[0.2em] text-[#333333]/70 animate-pulse"> 
              CONNECTING... 
            </h2> 
          </motion.div> 
        ) : ( 
          <motion.div 
            key="quiz" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full max-w-2xl z-10" 
          > 
            <div className="text-center mb-12 space-y-4"> 
              <h1 className="text-3xl md:text-5xl font-serif text-[#333333]/90 tracking-wide"> 
                Hey there, what's on your mind?
              </h1> 
              <p className="text-lg text-[#333333]/40 font-light"> 
                Choose how you're feeling today
              </p> 
            </div> 
 
            <div className="grid gap-4"> 
              {options.map((option, idx) => ( 
                <motion.button 
                  key={option.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: idx * 0.1 }} 
                  onClick={() => handleSelect(option.id)} 
                  className={` 
                    group relative w-full text-left p-6 md:p-8 rounded-2xl border border-[#A67C52]/20
                    bg-white backdrop-blur-sm transition-all duration-500 ease-out 
                    flex items-center gap-6 
                    ${option.color} 
                    ${option.glow} 
                  `} 
                > 
                  <span className="text-4xl md:text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"> 
                    {option.icon} 
                  </span> 
                  <div> 
                    <h3 className="text-xl font-medium text-[#333333]/90 group-hover:text-[#333333] mb-1 transition-colors"> 
                      {option.title} 
                    </h3> 
                    <p className="text-sm text-[#333333]/40 group-hover:text-[#333333]/70 transition-colors font-light"> 
                      {option.desc} 
                    </p> 
                  </div> 
                   
                  <div className="absolute right-8 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500"> 
                    → 
                  </div> 
                </motion.button> 
              ))} 
            </div> 
          </motion.div> 
        )} 
      </AnimatePresence> 
    </div> 
  );
}
