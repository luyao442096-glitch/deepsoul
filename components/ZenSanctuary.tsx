'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Disc, Circle, ArrowLeft } from 'lucide-react';

type ArtifactMode = 'echo' | 'loop';

function WoodenFish({ onTap, isMuted }: { onTap: () => void; isMuted: boolean }) {
  const [isPressed, setIsPressed] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playWoodFishSound = () => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  };

  const handleClick = () => {
    initAudio();
    setIsPressed(true);
    playWoodFishSound();
    onTap();
    
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        animate={isPressed ? { scale: 0.95, rotate: [-2, 0, 2] } : { scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 20,
          duration: 0.15
        }}
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        <motion.div
          animate={isPressed ? { 
            boxShadow: '0 0 60px rgba(139, 90, 43, 0.4), 0 20px 60px rgba(0, 0, 0, 0.6)' 
          } : { 
            boxShadow: '0 0 40px rgba(139, 90, 43, 0.2), 0 30px 80px rgba(0, 0, 0, 0.5)' 
          }}
          transition={{ duration: 0.15 }}
          className="relative"
        >
          <img 
            src="/wood-block-real.png" 
            alt="Wooden Fish" 
            className="w-[400px] h-[320px] object-contain drop-shadow-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg width="400" height="320" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#8B5A2B;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#A0522D;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
                    </linearGradient>
                    <filter id="woodTexture">
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise"/>
                      <feDiffuseLighting in="noise" lighting-color="#8B5A2B" surfaceScale="2">
                        <feDistantLight azimuth="45" elevation="60"/>
                      </feDiffuseLighting>
                    </filter>
                  </defs>
                  <ellipse cx="200" cy="160" rx="180" ry="140" fill="url(#woodGradient)" filter="url(#woodTexture)" opacity="0.9"/>
                  <ellipse cx="200" cy="160" rx="180" ry="140" fill="none" stroke="#5D3A1A" stroke-width="3"/>
                  <ellipse cx="200" cy="160" rx="160" ry="120" fill="none" stroke="#4A2F0F" stroke-width="2" opacity="0.5"/>
                  <ellipse cx="200" cy="160" rx="140" ry="100" fill="none" stroke="#3D2608" stroke-width="1.5" opacity="0.3"/>
                </svg>
              `);
            }}
          />
        </motion.div>
      </motion.div>
      
      <motion.div
        animate={isPressed ? { opacity: 1, scale: 1.2 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl" />
      </motion.div>
    </div>
  );
}

function PrayerBeads({ onScroll, isMuted }: { onScroll: () => void; isMuted: boolean }) {
  const [beads, setBeads] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [isDragging, setIsDragging] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playBeadSound = () => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    if (Math.abs(info.offset.y) > 20) {
      playBeadSound();
      onScroll();
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      setBeads(prev => {
        const newBeads = [...prev];
        const moved = newBeads.shift();
        if (moved !== undefined) newBeads.push(moved);
        return newBeads;
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsDragging(true);
    playBeadSound();
    onScroll();
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setBeads(prev => {
      const newBeads = [...prev];
      const moved = newBeads.shift();
      if (moved !== undefined) newBeads.push(moved);
      return newBeads;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-[600px]">
      <motion.div
        className="relative cursor-grab active:cursor-grabbing touch-none"
        drag="y"
        dragConstraints={{ top: -100, bottom: 100 }}
        dragElastic={0.15}
        onDragStart={() => { initAudio(); setIsDragging(true); }}
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <img 
          src="/beads-real.png" 
          alt="Prayer Beads" 
          className="w-[280px] h-[520px] object-contain drop-shadow-2xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="280" height="520" viewBox="0 0 280 520" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="beadGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#8B6914;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#5D4E37;stop-opacity:1" />
                  </radialGradient>
                  <filter id="beadShine">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                    <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                    <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lighting-color="#FFFFFF" result="specOut">
                      <fePointLight x="-5000" y="-10000" z="20000"/>
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                  </filter>
                </defs>
                ${[...Array(10)].map((_, i) => `
                  <circle cx="140" cy="${60 + i * 48}" r="22" fill="url(#beadGradient)" filter="url(#beadShine)" opacity="0.95"/>
                  <circle cx="140" cy="${60 + i * 48}" r="22" fill="none" stroke="#3D2608" stroke-width="1" opacity="0.3"/>
                `).join('')}
              </svg>
            `);
          }}
        />
      </motion.div>
      
      <motion.div
        animate={isDragging ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl" />
      </motion.div>
    </div>
  );
}

export default function ZenSanctuary() {
  const [mode, setMode] = useState<ArtifactMode>('echo');
  const [isMuted, setIsMuted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);

  const handleTap = () => {
    setTapCount(prev => prev + 1);
  };

  const handleScroll = () => {
    setScrollCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/bg-zen-room.jpg" 
          alt="Zen Room Background" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="roomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#F5E6D3;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#E8D5C4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#D4C4B0;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFF8DC;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#FFF8DC;stop-opacity:0" />
                  </linearGradient>
                </defs>
                <rect width="1920" height="1080" fill="url(#roomGradient)"/>
                <rect width="1920" height="1080" fill="url(#lightGradient)"/>
                <rect x="0" y="0" width="1920" height="400" fill="#FFF8DC" opacity="0.3"/>
              </svg>
            `);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-900/10" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="absolute top-6 left-6 z-20">
          <button className="p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg">
            <ArrowLeft className="w-5 h-5 text-amber-900" />
          </button>
        </div>

        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-amber-900" /> : <Volume2 className="w-5 h-5 text-amber-900" />}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <AnimatePresence mode="wait">
            {mode === 'echo' && (
              <motion.div
                key="echo"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-8"
              >
                <WoodenFish onTap={handleTap} isMuted={isMuted} />
                <div className="text-center space-y-2">
                  <p className="text-amber-900/60 text-sm font-serif tracking-wider uppercase">Mindful Taps</p>
                  <p className="text-amber-900 text-4xl font-serif">{tapCount}</p>
                </div>
              </motion.div>
            )}

            {mode === 'loop' && (
              <motion.div
                key="loop"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-8"
              >
                <PrayerBeads onScroll={handleScroll} isMuted={isMuted} />
                <div className="text-center space-y-2">
                  <p className="text-amber-900/60 text-sm font-serif tracking-wider uppercase">Mindful Scrolls</p>
                  <p className="text-amber-900 text-4xl font-serif">{scrollCount}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-8 right-8 z-20 flex gap-4">
          <button
            onClick={() => setMode('echo')}
            className={`p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${
              mode === 'echo' 
                ? 'bg-amber-100/60 scale-110' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Disc className={`w-6 h-6 ${mode === 'echo' ? 'text-amber-900' : 'text-amber-900/60'}`} />
          </button>

          <button
            onClick={() => setMode('loop')}
            className={`p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${
              mode === 'loop' 
                ? 'bg-amber-100/60 scale-110' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Circle className={`w-6 h-6 ${mode === 'loop' ? 'text-amber-900' : 'text-amber-900/60'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
