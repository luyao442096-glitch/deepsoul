'use client';

import { useState } from 'react';

interface ChatFooterProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  theme: {
    bg: string;
    container: string;
    textMain: string;
    textSub: string;
    inputBg: string;
    userMsg: string;
    aiMsg: string;
    accent: string;
  };
}

export default function ChatFooter({ input, setInput, onSend, theme }: ChatFooterProps) {
  // === PANDA STATE ===
  const [showPetModal, setShowPetModal] = useState(false);
  const [userCredits, setUserCredits] = useState(5);
  const [petStats, setPetStats] = useState({ energy: 40 });
  const [isPoked, setIsPoked] = useState(false);
  const [pandaThought, setPandaThought] = useState('');

  const lazyThoughts = ["Zzz... 🎋", "Shh...", "Five more minutes...", "Where's my bamboo?", "Huh?", "So hungry..."];

  const handleFeed = () => {
    if (userCredits > 0) {
      setUserCredits(prev => prev - 1);
      setPetStats(prev => ({ ...prev, energy: Math.min(prev.energy + 20, 100) }));
    } else {
      alert("You are out of Bamboo. Recharge to keep your companion alive.");
    }
  };

  const handlePandaClick = () => {
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 500);
    const randomThought = lazyThoughts[Math.floor(Math.random() * lazyThoughts.length)];
    setPandaThought(randomThought);
    setTimeout(() => setPandaThought(''), 3000);
    setShowPetModal(!showPetModal);
  };

  return (
    <footer className="flex-none p-4 pb-8 z-20">
      <div className="flex items-end gap-3">
        {/* INPUT BAR */}
        <div className={`flex-1 ${theme.inputBg} backdrop-blur-2xl rounded-[2rem] flex items-center p-2 shadow-2xl`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Tell me what's on your mind..."
            className={`w-full bg-transparent border-none ${theme.textMain} px-5 py-3 focus:outline-none placeholder:${theme.textSub} font-light text-base`}
          />
          <button onClick={onSend} className={`p-3 rounded-full ${theme.textSub} hover:${theme.textMain} transition-all shrink-0`}>↑</button>
        </div>
        
        {/* PANDA INTERACTION */}
        <div className="relative shrink-0 mb-1">
           {/* THOUGHT BUBBLE */}
           {pandaThought && (
             <div className="absolute bottom-full right-0 mb-2 w-32 bg-white text-slate-900 px-3 py-1 text-xs rounded-xl shadow-lg z-50">
               {pandaThought}
             </div>
           )}
           
           {/* PANDA ICON */}
           <button onClick={handlePandaClick} className={`relative group transition-transform ${isPoked ? 'scale-95' : 'hover:scale-105'}`}>
             <div className="w-24 h-24 -mt-8 animate-sway-slow">
               {/* ENSURE THIS PATH MATCHES YOUR UPLOADED FILE NAME */}
               <img src="/assets/panda-chill.png" alt="Panda" className="w-full h-full object-contain drop-shadow-2xl" />
             </div>
             {petStats.energy < 30 && <div className="absolute top-0 right-4 animate-bounce">🍂</div>}
           </button>

           {/* FEEDING MODAL */}
           {showPetModal && (
              <div className={`absolute bottom-28 right-0 w-64 p-4 ${theme.container} rounded-2xl backdrop-blur-xl shadow-2xl z-50`}>
                <div className="flex justify-between items-center mb-3">
                   <h3 className={`${theme.accent} font-serif text-sm`}>SPIRIT BOND</h3>
                   <button onClick={() => setShowPetModal(false)} className={`${theme.textSub} hover:${theme.textMain}`}>×</button>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full mb-4">
                   <div className={`h-full ${theme.accent}`} style={{ width: `${petStats.energy}%` }} />
                </div>
                <button onClick={handleFeed} disabled={userCredits === 0} className={`w-full py-2 ${theme.accent} rounded-lg text-sm text-white`}>
                   {userCredits > 0 ? '🎋 Give Bamboo (-1)' : '🔒 Refill'}
                </button>
                <p className={`text-center text-[10px] ${theme.textSub} mt-2`}>Remaining: {userCredits}</p>
              </div>
           )}
        </div>
      </div>
    </footer>
  );
}