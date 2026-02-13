'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ArticleHeroProps {
  category: string;
}

interface StateOption {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadow: string;
  hoverBg: string;
  hoverShadow: string;
  description: string;
}

export default function ArticleHero({ category }: ArticleHeroProps) {
  const router = useRouter();

  const stateOptions: StateOption[] = [
    {
      id: 'burnout',
      label: 'Burnout',
      bgColor: 'bg-amber-900/30',
      borderColor: 'border-amber-700/40',
      shadow: 'shadow-[0_0_10px_rgba(146,64,14,0.3)]',
      hoverBg: 'bg-amber-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(146,64,14,0.4)]',
      description: 'Feeling exhausted and overwhelmed'
    },
    {
      id: 'cant-sleep',
      label: 'Can\'t Sleep',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-700/40',
      shadow: 'shadow-[0_0_10px_rgba(30,64,175,0.3)]',
      hoverBg: 'bg-blue-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(30,64,175,0.4)]',
      description: 'Insomnia or sleep disturbances'
    },
    {
      id: 'invisible',
      label: 'Invisible',
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-700/40',
      shadow: 'shadow-[0_0_10px_rgba(91,33,182,0.3)]',
      hoverBg: 'bg-purple-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(91,33,182,0.4)]',
      description: 'Feeling unseen or unheard'
    },
    {
      id: 'spiraling',
      label: 'Spiraling',
      bgColor: 'bg-teal-900/30',
      borderColor: 'border-teal-700/40',
      shadow: 'shadow-[0_0_10px_rgba(17,94,89,0.3)]',
      hoverBg: 'bg-teal-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(17,94,89,0.4)]',
      description: 'Anxious thoughts and worry'
    },
    {
      id: 'stuck',
      label: 'Stuck in Overwhelm',
      bgColor: 'bg-slate-900/30',
      borderColor: 'border-slate-700/40',
      shadow: 'shadow-[0_0_10px_rgba(51,65,85,0.3)]',
      hoverBg: 'bg-slate-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(51,65,85,0.4)]',
      description: 'Unable to move forward'
    }
  ];

  const normalizeCategory = (cat: string): string => {
    return cat.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const currentCategoryId = (() => {
    const normalizedCategory = normalizeCategory(category);
    if (normalizedCategory.includes('burnout')) return 'burnout';
    if (normalizedCategory.includes('sleep') || normalizedCategory.includes('insomnia')) return 'cant-sleep';
    if (normalizedCategory.includes('invisible')) return 'invisible';
    if (normalizedCategory.includes('spiral') || normalizedCategory.includes('anxiety')) return 'spiraling';
    if (normalizedCategory.includes('stuck') || normalizedCategory.includes('overwhelm')) return 'stuck';
    return null;
  })();

  const handleCircleClick = (id: string) => {
    router.push(`/category/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      
      <div className="z-10 text-center max-w-4xl px-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-serif mb-6 leading-tight"
        >
          How is your energy?
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-12"
        >
          Select the light that resonates with you.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {stateOptions.map((option, index) => {
            const isActive = currentCategoryId === option.id;
            return (
              <motion.div
                key={option.id}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCircleClick(option.id)}
                  className={`w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 rounded-full ${option.bgColor} border border-white/10 ${option.borderColor} ${option.shadow} hover:${option.hoverBg} hover:${option.hoverShadow} transition-all duration-500 ease-in-out flex items-center justify-center backdrop-blur-sm cursor-pointer`}
                  animate={{
                    boxShadow: [
                      `0 0 10px rgba(${option.id === 'burnout' ? '245,158,11' : option.id === 'cant-sleep' ? '59,130,246' : option.id === 'invisible' ? '168,85,247' : option.id === 'spiraling' ? '20,184,166' : '100,116,139'},${isActive ? '0.5' : '0.3'})`,
                      `0 0 20px rgba(${option.id === 'burnout' ? '245,158,11' : option.id === 'cant-sleep' ? '59,130,246' : option.id === 'invisible' ? '168,85,247' : option.id === 'spiraling' ? '20,184,166' : '100,116,139'},${isActive ? '0.7' : '0.5'})`,
                      `0 0 10px rgba(${option.id === 'burnout' ? '245,158,11' : option.id === 'cant-sleep' ? '59,130,246' : option.id === 'invisible' ? '168,85,247' : option.id === 'spiraling' ? '20,184,166' : '100,116,139'},${isActive ? '0.5' : '0.3'})`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className={`text-sm sm:text-base md:text-lg font-medium text-white ${isActive ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* 向下滑动提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/60"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </motion.div>
          <p className="text-sm text-white/40">Scroll down to read article</p>
        </motion.div>

      </div>
    </div>
  );
}