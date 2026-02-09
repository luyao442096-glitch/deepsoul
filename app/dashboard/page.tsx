'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Headphones, Sparkles, Ghost } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Deep Zen",
      desc: "White noise & Meditation",
      icon: <Headphones className="w-8 h-8 mb-4 text-slate-300" />,
      action: () => router.push('/dashboard/zen'), // Links to /dashboard/zen page
      bg: "bg-slate-800/50 hover:bg-slate-700/50"
    },
    {
      title: "Chat with Dylan",
      desc: "Your Northeast Buddy",
      icon: <Sparkles className="w-8 h-8 mb-4 text-amber-300" />,
      action: () => router.push('/dashboard/chat'), // Links directly to /dashboard/chat page
      bg: "bg-slate-800/80 hover:bg-slate-700/80 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
    },
    {
      title: "Spirit Pet",
      desc: "Nurture your inner self",
      icon: <Ghost className="w-8 h-8 mb-4 text-purple-300" />,
      action: () => router.push('/dashboard/pet'), // Links to /dashboard/pet page
      bg: "bg-slate-800/50 hover:bg-slate-700/50"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050A18] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-16 space-y-4 z-10" 
      >
        <h1 className="text-4xl md:text-6xl font-serif text-white/90 tracking-tight">
          The world is noisy. You are safe here.
        </h1>
        <p className="text-lg text-white/40 font-light tracking-wide">
          Let the day fade away.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        {cards.map((card, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 + 0.3 }}
            onClick={card.action}
            className={`
              relative group flex flex-col items-center justify-center p-10 rounded-3xl border border-white/5
              backdrop-blur-xl transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2
              ${card.bg}
            `}
          >
            {/* Icon */}
            <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {card.icon}
            </div>
            
            {/* Text */}
            <h3 className="text-2xl font-serif mb-2 text-white/90">{card.title}</h3>
            <p className="text-sm text-white/40 font-light">{card.desc}</p>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
          </motion.button>
        ))}
      </div>

    </div>
  );
}
