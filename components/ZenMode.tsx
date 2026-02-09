"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { X, Volume2, VolumeX, Infinity as InfinityIcon } from "lucide-react";

export default function ZenMode({ onExit }: { onExit: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 声音渐入效果
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0; 
      
      const fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 0.6) {
          audioRef.current.volume = Math.min(0.6, audioRef.current.volume + 0.02);
        } else {
          clearInterval(fadeInterval);
        }
      }, 200);
      
      audioRef.current.play().catch(e => console.log("需用户交互才能播放", e));
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ✅✅✅ 这里已经改好了，指向您刚才放好的本地文件 */}
      <audio 
        ref={audioRef} 
        loop 
        src="/sounds/zen.mp3" 
      />

      {/* 顶部控制栏 */}
      <div className="absolute top-6 right-6 flex items-center gap-6 z-50">
        <button 
          onClick={toggleMute}
          className="text-white/20 hover:text-white/80 transition-colors duration-500"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <button 
          onClick={onExit}
          className="text-white/20 hover:text-white/80 transition-colors border border-white/5 rounded-full p-2 hover:bg-white/5 duration-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* 🌟 视觉动效保持不变 */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.3, 1], 
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 90, 0] 
          }}
          transition={{
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-900/20 to-purple-900/20 blur-[100px] absolute"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-48 h-48 rounded-full bg-blue-500/10 blur-[60px] absolute mix-blend-screen"
        />

        <motion.div 
            className="z-10 text-center space-y-6 flex flex-col items-center"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            <InfinityIcon size={48} className="text-indigo-200/30" strokeWidth={1} />
            
            <div className="space-y-2">
                <h2 className="text-3xl text-white/80 font-serif tracking-[0.2em] font-light">
                    DRIFT
                </h2>
                <p className="text-indigo-200/20 text-xs tracking-[0.4em] uppercase">
                    Let the sound carry you
                </p>
            </div>
        </motion.div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-white/10 text-[10px] font-mono tracking-widest"
      >
        432Hz DEEP AMBIENT AUDIO
      </motion.p>
    </motion.div>
  );
}