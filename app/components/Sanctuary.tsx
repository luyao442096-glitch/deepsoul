'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Disc, Circle, Volume2, VolumeX, ChevronLeft } from 'lucide-react';

type ArtifactMode = 'selection' | 'echo' | 'loop';
type CardType = 'echo' | 'loop';

interface ArtifactCardProps {
  type: CardType;
  title: string;
  subtitle: string;
  onSelect: () => void;
}

interface EchoBlockProps {
  onTap: () => void;
}

interface InfinityLoopProps {
  onScroll: () => void;
}

// Phase 1: ArtifactCard Component
const ArtifactCard: React.FC<ArtifactCardProps> = ({ type, title, subtitle, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.95 }}
      className="relative w-80 h-96 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
      
      {/* Icon */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 flex items-center justify-center">
        {type === 'echo' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-amber-500/30 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-900/40 to-amber-950/60 rounded-full" />
          </motion.div>
        ) : (
          <motion.div className="relative w-24 h-24">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-blue-400/40 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-32px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Content */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <h3 className="text-2xl font-serif text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </motion.div>
  );
};

// Phase 2: EchoBlock Component
const EchoBlock: React.FC<EchoBlockProps> = ({ onTap }) => {
  const [ripple, setRipple] = useState(false);
  const spring = useSpring(1, {
    damping: 20,
    stiffness: 300,
  });
  const scale = useTransform(spring, [0.9, 1], [0.9, 1]);

  const handleTap = () => {
    setRipple(true);
    spring.set(0.9);
    setTimeout(() => setRipple(false), 500);
    onTap();
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-64 h-48 rounded-[2rem] border-2 border-amber-500/30"
          />
        )}
      </AnimatePresence>
      
      {/* Wood Block */}
      <motion.div
        style={{ scale }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className="
          relative w-64 h-48 rounded-[2rem] 
          bg-gradient-to-br from-[#2c241b] to-[#1a140e]
          shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]
          border border-white/5
          flex items-center justify-center
          overflow-hidden
          cursor-pointer
        "
      >
        {/* Wood Texture Layer */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
        
        {/* Lighting Highlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        
        {/* Inner Shadow/Depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] rounded-[2rem]" />

        <span className="relative text-amber-900/40 font-serif italic text-lg pointer-events-none select-none">
          tap to release
        </span>
      </motion.div>
    </div>
  );
};

// Phase 3: InfinityLoop Component
const InfinityLoop: React.FC<InfinityLoopProps> = ({ onScroll }) => {
  const [beads, setBeads] = useState([0, 1, 2, 3, 4]);
  const [rotation, setRotation] = useState(0);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.y) > 20) {
      onScroll();
      // Vibrate on mobile if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
      // Rotate beads array to simulate infinite scroll visual
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
    setRotation(p => p + e.deltaY * 0.1);
    onScroll();
  };

  return (
    <div className="h-96 flex flex-col items-center justify-center relative w-24" onWheel={handleWheel}>
      {/* The String (Center Line) */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-white/10 z-0 left-1/2 -translate-x-1/2" />

      {/* The Beads Stack */}
      <motion.div 
        className="flex flex-col gap-4 z-10 cursor-grab active:cursor-grabbing touch-none"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {beads.map((i) => (
          <motion.div
            key={i}
            className="
              w-12 h-12 rounded-full 
              bg-gradient-to-br from-slate-700 to-slate-900
              shadow-lg border border-white/5
              flex-shrink-0
              relative
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Bead Shine */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/10 rounded-full blur-[1px]" />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-[10px] text-white/20 w-20 select-none">
        Drag to focus
      </div>
    </div>
  );
};

// Main Sanctuary Component
export default function Sanctuary() {
  const [mode, setMode] = useState<ArtifactMode>('selection');
  const [isMuted, setIsMuted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [haruState, setHaruState] = useState<'idle' | 'active'>('idle');

  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  // Audio Placeholder Functions
  const playClickSound = () => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const playScrollSound = () => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  // Trigger Haru Activation
  const triggerHaru = () => {
    setHaruState('active');
    setTimeout(() => setHaruState('idle'), 500);
  };

  // Handle Artifact Selection
  const handleSelectArtifact = (selectedMode: 'echo' | 'loop') => {
    setMode(selectedMode);
  };

  // Handle Echo Block Tap
  const handleEchoTap = () => {
    setTapCount(prev => prev + 1);
    playClickSound();
    triggerHaru();
  };

  // Handle Infinity Loop Scroll
  const handleLoopScroll = () => {
    playScrollSound();
    triggerHaru();
  };

  // Return to Selection
  const handleReturnToSelection = () => {
    setMode('selection');
    setTapCount(0);
  };

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-b from-[#0F172A] to-[#020617] text-white font-sans flex flex-col items-center relative overflow-hidden selection:bg-none touch-none"
      onClick={initAudio}
    >
      {/* Dynamic Background Gradient */}
      <motion.div 
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"
      />

      {/* Header */}
      <div className="w-full px-6 py-6 flex items-center justify-between z-50">
        {mode !== 'selection' && (
          <button 
            onClick={handleReturnToSelection} 
            className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
        )}
        
        {mode === 'echo' && (
          <div className="flex items-center gap-2 opacity-70">
            <span className="text-sm">Mindful Taps:</span>
            <span className="text-lg font-serif">{tapCount}</span>
          </div>
        )}
        
        {mode !== 'selection' && (
          <button onClick={() => setIsMuted(!isMuted)} className="opacity-50 hover:opacity-100">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {/* Phase 1: Selection Mode */}
          {mode === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-12"
            >
              <ArtifactCard
                type="echo"
                title="The Echo Block"
                subtitle="For Anxiety & Chaos"
                onSelect={() => handleSelectArtifact('echo')}
              />
              <ArtifactCard
                type="loop"
                title="The Infinity Loop"
                subtitle="For Focus & Restlessness"
                onSelect={() => handleSelectArtifact('loop')}
              />
            </motion.div>
          )}

          {/* Phase 2: Echo Block Mode */}
          {mode === 'echo' && (
            <motion.div
              key="echo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex flex-col items-center"
            >
              <EchoBlock onTap={handleEchoTap} />
              
              {/* Haru (Wisp) */}
              <motion.div
                className="absolute pointer-events-none"
                animate={{
                  top: '30%',
                  left: '70%',
                }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  animate={{
                    scale: haruState === 'active' ? [1, 1.5, 1] : 1,
                    opacity: haruState === 'active' ? 1 : 0.6,
                    boxShadow: haruState === 'active'
                      ? '0 0 20px rgba(251, 191, 36, 0.6)'
                      : '0 0 10px rgba(251, 191, 36, 0.2)'
                  }}
                  className="w-4 h-4 bg-amber-300 rounded-full blur-[3px]"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Phase 3: Infinity Loop Mode */}
          {mode === 'loop' && (
            <motion.div
              key="loop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex flex-col items-center"
            >
              <InfinityLoop onScroll={handleLoopScroll} />
              
              {/* Haru (Wisp) */}
              <motion.div
                className="absolute pointer-events-none"
                animate={{
                  top: '40%',
                  left: '20%',
                }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  animate={{
                    scale: haruState === 'active' ? [1, 1.5, 1] : 1,
                    opacity: haruState === 'active' ? 1 : 0.6,
                    boxShadow: haruState === 'active'
                      ? '0 0 20px rgba(251, 191, 36, 0.6)'
                      : '0 0 10px rgba(251, 191, 36, 0.2)'
                  }}
                  className="w-4 h-4 bg-amber-300 rounded-full blur-[3px]"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {mode === 'selection' && (
        <div className="mb-12 z-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <h2 className="text-2xl font-serif mb-2">Digital Zen Artifacts</h2>
            <p className="text-sm text-white/60">Select an artifact to begin your journey</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
