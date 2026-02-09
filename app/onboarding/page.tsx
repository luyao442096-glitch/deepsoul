"use client";

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Moon, Heart, Brain, Phone, Briefcase, Cloud, Flame, Rocket, Coffee, Sun } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 灵魂 7 问数据
const SOUL_QUESTIONS = [
  {
    id: 'energy',
    title: 'Energy',
    question: "How is your energy right now?",
    options: [
      {
        text: "Drained",
        icon: Coffee,
        value: "drained",
        guardian: "haru",
        color: "cyan",
        mood: "exhausted"
      },
      {
        text: "Turbulent",
        icon: Sparkles,
        value: "turbulent",
        guardian: "chitose",
        color: "red",
        mood: "anxious"
      },
      {
        text: "Empty",
        icon: Moon,
        value: "empty",
        guardian: "echo",
        color: "purple",
        mood: "numb"
      }
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep',
    question: "What happens when you close your eyes?",
    options: [
      {
        text: "Room spins",
        icon: Sparkles,
        value: "room_spins",
        guardian: "chitose",
        color: "green",
        mood: "disoriented"
      },
      {
        text: "Doomscrolling",
        icon: Phone,
        value: "doomscrolling",
        guardian: "echo",
        color: "purple",
        mood: "addicted"
      },
      {
        text: "Overthinking",
        icon: Brain,
        value: "overthinking",
        guardian: "haru",
        color: "cyan",
        mood: "anxious"
      }
    ]
  },
  {
    id: 'social',
    title: 'Social',
    question: "The phone is ringing. You...",
    options: [
      {
        text: "Just watch it ring",
        icon: Phone,
        value: "watch_ring",
        guardian: "echo",
        color: "purple",
        mood: "detached"
      },
      {
        text: "Want to answer but can't",
        icon: Heart,
        value: "want_answer",
        guardian: "haru",
        color: "cyan",
        mood: "conflicted"
      },
      {
        text: "Decline immediately",
        icon: Phone,
        value: "decline",
        guardian: "chitose",
        color: "green",
        mood: "avoidant"
      }
    ]
  },
  {
    id: 'stress',
    title: 'Stress Source',
    question: "What weighs heaviest on your chest?",
    options: [
      {
        text: "Work & Future",
        icon: Briefcase,
        value: "work",
        guardian: "chitose",
        color: "green",
        mood: "pressured"
      },
      {
        text: "Love & Relationships",
        icon: Heart,
        value: "love",
        guardian: "haru",
        color: "cyan",
        mood: "vulnerable"
      },
      {
        text: "Unknown Sadness",
        icon: Moon,
        value: "unknown",
        guardian: "echo",
        color: "purple",
        mood: "confused"
      }
    ]
  },
  {
    id: 'needs',
    title: 'Needs',
    question: "What do you need most at this moment?",
    options: [
      {
        text: "Just listen",
        icon: Heart,
        value: "just_listen",
        guardian: "echo",
        color: "purple",
        mood: "heard"
      },
      {
        text: "Give solutions",
        icon: Brain,
        value: "give_solutions",
        guardian: "chitose",
        color: "green",
        mood: "empowered"
      },
      {
        text: "Just company",
        icon: Heart,
        value: "just_company",
        guardian: "haru",
        color: "cyan",
        mood: "connected"
      }
    ]
  },
  {
    id: 'safe',
    title: 'Safe House',
    question: "Where do you feel safest?",
    options: [
      {
        text: "Rainy window",
        icon: Cloud,
        value: "rainy_window",
        guardian: "echo",
        color: "purple",
        mood: "peaceful"
      },
      {
        text: "Bonfire",
        icon: Flame,
        value: "bonfire",
        guardian: "haru",
        color: "cyan",
        mood: "warm"
      },
      {
        text: "Deep space",
        icon: Rocket,
        value: "deep_space",
        guardian: "chitose",
        color: "green",
        mood: "cosmic"
      }
    ]
  },
  {
    id: 'wish',
    title: 'Wish',
    question: "If I could grant you one wish tonight...",
    options: [
      {
        text: "Deep sleep",
        icon: Moon,
        value: "deep_sleep",
        guardian: "haru",
        color: "cyan",
        mood: "restful"
      },
      {
        text: "A real smile",
        icon: Sun,
        value: "real_smile",
        guardian: "echo",
        color: "purple",
        mood: "joyful"
      },
      {
        text: "Empty mind",
        icon: Brain,
        value: "empty_mind",
        guardian: "chitose",
        color: "green",
        mood: "calm"
      }
    ]
  }
];

// 守护灵数据
const GUARDIANS = {
  haru: {
    name: "Haru",
    title: "The Healer",
    tag: "Gentle & Warm",
    quote: "The world is noisy. Let me be your quiet place.",
    description: "A gentle soul who wraps you in warmth and understanding. Haru listens without judgment and helps you find peace in the chaos.",
    color: "cyan"
  },
  chitose: {
    name: "Chitose",
    title: "The Guide",
    tag: "Calm & Rational",
    quote: "Take a breath. We will untangle this together.",
    description: "A calm and rational presence who helps you navigate life's challenges with clarity and purpose.",
    color: "green"
  },
  echo: {
    name: "Echo",
    title: "The Listener",
    tag: "Deep & Silent",
    quote: "No words needed. I am here.",
    description: "A quiet observer who meets you exactly where you are, offering presence without pressure.",
    color: "purple"
  }
};

// 计算匹配的守护灵
const calculateGuardian = (answers: any[]) => {
  const counts = {
    haru: 0,
    chitose: 0,
    echo: 0
  };

  answers.forEach(answer => {
    if (answer.guardian === 'haru') counts.haru++;
    if (answer.guardian === 'chitose') counts.chitose++;
    if (answer.guardian === 'echo') counts.echo++;
  });

  // 找出最多的守护灵
  if (counts.haru >= counts.chitose && counts.haru >= counts.echo) {
    return GUARDIANS.haru;
  } else if (counts.chitose >= counts.haru && counts.chitose >= counts.echo) {
    return GUARDIANS.chitose;
  } else {
    return GUARDIANS.echo;
  }
};

// 获取颜色类名
const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'blue',
    cyan: 'cyan',
    green: 'green',
    purple: 'purple',
    red: 'red',
    orange: 'orange'
  };
  return colorMap[color] || 'cyan';
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [guardian, setGuardian] = useState<any>(null);
  const [orbColor, setOrbColor] = useState("cyan");

  // 计算进度
  const progress = ((currentStep + 1) / SOUL_QUESTIONS.length) * 100;

  // 处理选项选择
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnalyzing || showResults) return;

    setSelectedOption(optionIndex);

    const currentQuestion = SOUL_QUESTIONS[currentStep];
    const selectedAnswer = currentQuestion.options[optionIndex];
    
    // 更新答案
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    // 更新颜色
    setOrbColor(selectedAnswer.color);
    
    // 检查是否完成所有问题
    if (currentStep < SOUL_QUESTIONS.length - 1) {
      // 进入下一题
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      // 完成所有问题，进入分析
      setIsAnalyzing(true);
      
      // 3秒后显示结果
      setTimeout(() => {
        const matchedGuardian = calculateGuardian(newAnswers);
        setGuardian(matchedGuardian);
        setOrbColor(matchedGuardian.color);
        setIsAnalyzing(false);
        setShowResults(true);
        // 设置测试完成标记
        localStorage.setItem('testCompleted', 'true');
      }, 3000);
    }
  };

  // 处理 Google 登录
  const handleLogin = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) console.error("Login failed:", error);
  };

  // 渲染分析中状态
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#050A18] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* 中心光源 */}
        <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${getColorClass(orbColor)}-500/20 via-[#050A18]/80 to-[#050A18]`}></div>
        </div>
        
        <div className="z-10 text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg animate-pulse">
            Connecting to Soul...
          </h1>
          <p className="text-slate-400 text-lg">
            Your guardian is awakening
          </p>
        </div>
      </div>
    );
  }

  // 渲染结果页
  if (showResults && guardian) {
    return (
      <div className="min-h-screen bg-[#050A18] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* 中心光源 */}
        <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${getColorClass(guardian.color)}-500/20 via-[#050A18]/80 to-[#050A18]`}></div>
        </div>
        
        <div className="z-10 max-w-md w-full text-center animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-serif text-white drop-shadow-lg mb-4">
            {guardian.name}
          </h1>
          
          <p className="text-2xl text-slate-400 mb-8">
            {guardian.tag}
          </p>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-12">
            <p className="text-slate-300 italic mb-4 text-lg">
              "{guardian.quote}"
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {guardian.description}
            </p>
          </div>
          
          <button 
            onClick={handleLogin}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all backdrop-blur-md flex items-center gap-2 mx-auto"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  // 渲染问卷页面
  const currentQuestion = SOUL_QUESTIONS[currentStep];
  return (
    <div className="min-h-screen bg-[#050A18] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 中心光源 */}
      <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${getColorClass(orbColor)}-500/20 via-[#050A18]/80 to-[#050A18]`}></div>
      </div>
      
      {/* 顶部进度条 */}
      <div className="absolute top-0 left-0 h-1 bg-white/20 w-full z-20">
        <div 
          className="h-full bg-gradient-to-r from-white to-slate-300 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* 问题标题 */}
      <div className="z-10 max-w-2xl text-center mb-16">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          {currentQuestion.title}
        </p>
        <h2 className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg leading-relaxed">
          {currentQuestion.question}
        </h2>
      </div>
      
      {/* 胶囊形按钮选项 */}
      <div className="z-10 w-full max-w-3xl flex flex-col gap-8 mb-16">
        {currentQuestion.options.map((option, index) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === index;
          
          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`group relative px-8 py-6 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-500 ease-out
                ${isSelected 
                  ? 'bg-white/20 border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.6)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                }`}
            >
              <div className="flex items-center justify-center gap-4">
                <IconComponent 
                  className={`w-6 h-6 transition-all duration-300
                    ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                  `}
                />
                <span className={`text-xl font-medium transition-all duration-300
                  ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                `}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 进度指示器 */}
      <div className="z-10 text-center text-slate-400 text-xs mb-8">
        {currentStep + 1} / {SOUL_QUESTIONS.length}
      </div>
    </div>
  );
}
