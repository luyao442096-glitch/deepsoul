'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ChatBackgroundProps {
  currentPersona: string;
}

export default function ChatBackground({ currentPersona }: ChatBackgroundProps) {
  const getVideoSource = () => {
    switch (currentPersona) {
      case 'void': return '/assets/bg-void.mp4';
      case 'chitose': return '/assets/bg-chitose.mp4';
      case 'haru': default: return '/assets/bg-haru.mp4';
    }
  };

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {/* 1. Fallback Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />
      
      {/* 2. Dynamic Video Layer (Blurred & Darkened) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPersona}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-10"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 filter blur-[4px] scale-105"
          >
            <source src={getVideoSource()} type="video/mp4" />
          </video>
        </motion.div>
      </AnimatePresence>
      
      {/* 3. Heavy Vignette Overlay (Crucial for Text Readability) */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-black/80" />

      {/* 4. Center Character (Final Polish) */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
         <AnimatePresence mode="wait">
           <motion.div 
             key={currentPersona} 
             initial={{ scale: 0.9, opacity: 0 }} 
             animate={{ scale: 1, opacity: 1 }} 
             exit={{ scale: 1.1, opacity: 0 }} 
             transition={{ duration: 0.8 }} 
             className="relative flex items-center justify-center" 
           > 
             
             {/* === PERSONA: HARU (Warmth - Bear) === */} 
             {currentPersona === 'haru' && ( 
               <> 
                 <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-amber-600/20 animate-pulse-slow" /> 
                 <div className="text-[14rem] drop-shadow-2xl filter brightness-110 relative z-10 transition-transform duration-1000 hover:scale-105">🧸</div> 
               </> 
             )} 
 
             {/* === PERSONA: CHITOSE (Logic - The Data Core) === */} 
             {currentPersona === 'chitose' && ( 
               <div className="relative flex items-center justify-center"> 
                 {/* 1. Outer Aura */} 
                 <div className="absolute w-[500px] h-[500px] rounded-full blur-[90px] bg-emerald-500/10 animate-pulse" /> 
                 
                 {/* 2. Rotating Outer Ring */} 
                 <div className="absolute w-[320px] h-[320px] border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" /> 
                 <div className="absolute w-[280px] h-[280px] border border-dashed border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" /> 
                 
                 {/* 3. The Core (Floating Cube) */} 
                 <div className="relative w-48 h-48 border-2 border-emerald-400/50 bg-emerald-900/20 backdrop-blur-md rounded-xl transform rotate-45 shadow-[0_0_50px_rgba(52,211,153,0.4)] flex items-center justify-center animate-float-slow"> 
                    {/* Inner Square */} 
                    <div className="w-24 h-24 border border-emerald-200/50 rounded-lg flex items-center justify-center"> 
                       {/* The "Eye" of the AI */} 
                       <div className="w-8 h-8 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399] animate-pulse" /> 
                    </div> 
                 </div> 
               </div> 
             )} 
 
             {/* === PERSONA: VOID (The Black Hole) === */} 
             {currentPersona === 'void' && ( 
               <div className="relative"> 
                 {/* Accretion Disk */} 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-violet-600/30 rounded-full blur-[60px] animate-pulse-slow" /> 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-indigo-500/20 rounded-full blur-[30px]" /> 
                 
                 {/* Event Horizon */} 
                 <div className="relative w-64 h-64 rounded-full bg-black shadow-[0_0_60px_rgba(139,92,246,0.5),inset_0_0_60px_rgba(0,0,0,0.9)] border border-white/5 overflow-hidden"> 
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] opacity-50" /> 
                 </div> 
               </div> 
             )} 
 
           </motion.div> 
         </AnimatePresence> 
      </div>
    </div>
  );
}
