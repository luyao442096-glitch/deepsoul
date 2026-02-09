"use client";
import React, { useState, useEffect, useRef } from "react";
import Soul from "./Soul";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Sparkles, User, Check, Edit3 } from "lucide-react";

// 🎭 角色数据
const CHARACTERS = {
  female: {
    id: 'female',
    defaultName: "Haru",
    path: '/live2d/haru_greeter_t03/haru_greeter_t03.model3.json',
    desc: "Gentle & Healing",
    intro: "The world is noisy. Let me be your quiet place.",
    welcome: "I'm here. Just for you. What's on your mind?",
    color: "from-indigo-400 to-purple-500",
    glow: "group-hover:shadow-indigo-500/50",
  },
  male: {
    id: 'male',
    defaultName: "Chitose",
    path: '/live2d/Chitose/chitose.model3.json', 
    desc: "Calm & Guardian",
    intro: "Take a breath. I'll handle the weight with you.",
    welcome: "Hey. You're safe here. I'm listening.",
    color: "from-blue-400 to-cyan-500",
    glow: "group-hover:shadow-blue-500/50",
  }
};

type Message = { id: string; role: "user" | "ai"; text: string; };

export default function RealCompanion({ onExit }: { onExit: () => void }) {
  // 🌟 状态机：控制流程
  // 1. selection: 选人
  // 2. naming: 起名
  // 3. chat: 聊天
  const [step, setStep] = useState<'selection' | 'naming' | 'chat'>('selection');
  
  const [selectedCharId, setSelectedCharId] = useState<'female' | 'male' | null>(null);
  const [partnerName, setPartnerName] = useState(""); // 用户给 TA 起的名字

  // ------------------------------------------------------------------
  // 1️⃣ 阶段一：选人界面 (Selection)
  // ------------------------------------------------------------------
  if (step === 'selection') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-white font-sans z-50">
        
        {/* 顶部返回 */}
        <button onClick={onExit} className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} /> <span className="uppercase tracking-widest text-sm font-medium">Back to Hall</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight font-serif">Choose Your Soulmate</h2>
          <p className="text-white/40 text-lg font-light tracking-wide">Who resonates with your energy today?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <SelectionCard 
            char={CHARACTERS.female} 
            onClick={() => { setSelectedCharId('female'); setPartnerName(CHARACTERS.female.defaultName); setStep('naming'); }} 
          />
          <SelectionCard 
            char={CHARACTERS.male} 
            onClick={() => { setSelectedCharId('male'); setPartnerName(CHARACTERS.male.defaultName); setStep('naming'); }} 
          />
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 2️⃣ 阶段二：起名仪式 (Naming)
  // ------------------------------------------------------------------
  if (step === 'naming' && selectedCharId) {
    const char = CHARACTERS[selectedCharId];
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-white font-sans z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] max-w-md w-full text-center shadow-2xl"
        >
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${char.color} mb-6 flex items-center justify-center shadow-lg`}>
            <User size={32} className="text-white" />
          </div>
          
          <h3 className="text-2xl font-serif mb-2">One Last Thing...</h3>
          <p className="text-white/50 mb-8 text-sm">How would you like to call {selectedCharId === 'female' ? 'her' : 'him'}?</p>

          <div className="relative mb-8 group">
            <input 
              type="text" 
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full bg-white/5 border-b-2 border-white/20 text-center text-3xl py-2 focus:border-indigo-500 focus:outline-none transition-colors font-serif bg-transparent text-white"
              autoFocus
            />
            <Edit3 size={16} className="absolute right-2 top-4 text-white/20" />
          </div>

          <button 
            onClick={() => setStep('chat')}
            className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest uppercase hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} /> Connect Soul
          </button>
          
          <button onClick={() => setStep('selection')} className="mt-4 text-xs text-white/30 hover:text-white transition-colors">
            Choose someone else
          </button>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 3️⃣ 阶段三：专属聊天 (Chat - 绑定状态)
  // ------------------------------------------------------------------
  // 此时 selectedCharId 和 partnerName 必定有值
  if (selectedCharId) {
    return (
      <ChatInterface 
        char={CHARACTERS[selectedCharId]} 
        customName={partnerName} 
        onExit={onExit} 
      />
    );
  }
  return null;
}

// ✨ 组件：选择卡片
function SelectionCard({ char, onClick }: { char: any, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center text-center p-8 h-[340px] rounded-[2.5rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md transition-all duration-500 overflow-hidden ${char.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${char.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* 角色氛围图/图标 */}
      <div className={`mb-8 p-5 rounded-full bg-gradient-to-br ${char.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        <User size={32} className="text-white" />
      </div>

      <h3 className="text-3xl font-medium text-white/90 font-serif mb-3">{char.defaultName}</h3>
      <div className="px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-6 bg-black/20">
        {char.desc}
      </div>

      <p className="text-sm text-white/40 leading-relaxed max-w-[85%] italic font-light">
        "{char.intro}"
      </p>
    </motion.button>
  );
}

// ✨ 组件：聊天核心
function ChatInterface({ char, customName, onExit }: { char: any, customName: string, onExit: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化：用自定义的名字打招呼
  useEffect(() => {
    // 替换欢迎语中的称呼（如果有的话）
    setMessages([{ id: "init", role: "ai", text: char.welcome }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      setIsTalking(true);
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: "I hear you. Tell me more."
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => setIsTalking(false), 3000);
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden flex flex-col font-sans">
      
      {/* 💃 Soul: 只渲染选定的那个人 */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Soul key={char.id} isTalking={isTalking} modelPath={char.path} />
      </div>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent z-10 pointer-events-none" />

      {/* 💬 聊天 UI */}
      <div className="absolute inset-0 z-20 flex flex-col h-full max-w-3xl mx-auto px-4 md:px-6">
        
        {/* 顶部：只有退出，绝无切换 */}
        <div className="flex items-center justify-between py-6">
          <button onClick={onExit} className="text-white/60 hover:text-white flex items-center gap-2 transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
            <ArrowLeft size={16} /> <span className="text-xs uppercase font-medium">Leave Session</span>
          </button>
          
          {/* 显示羁绊名字 */}
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <Sparkles size={12} className="text-indigo-400" />
            Connected with {customName}
          </div>
        </div>

        {/* 消息流 */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide py-4">
           <div className="h-[45vh]"></div>
           {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-[15px] leading-relaxed shadow-lg backdrop-blur-md
                ${msg.role === "user" 
                  ? "bg-white/10 border border-white/10 text-white rounded-br-none" 
                  : "bg-black/40 border border-white/5 text-gray-200 rounded-bl-none"
                }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isAiThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-2 items-center text-white/40 text-xs uppercase pl-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                <Sparkles size={12} /><span>Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="pb-8 pt-2">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message ${customName}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:bg-black/60 focus:border-white/20 transition-all backdrop-blur-xl outline-none placeholder:text-white/20"
            />
            <button onClick={handleSend} disabled={!inputValue.trim()} className={`absolute right-2 top-2 p-2.5 text-white rounded-xl transition-all ${inputValue.trim() ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-white/5 text-white/20'}`}>
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}