'use client';

import { useState, useEffect, useRef } from 'react';
import ChatFooter from './ChatFooter';
import PaywallModal from './PaywallModal';
import ClearChatModal from './ClearChatModal';
// Import new advanced logic
import { getGreeting, getNextReply, getThinkingTime, getTypingText } from '../lib/chatLogic';

interface ChatUIProps {
  currentPersona: string;
  onPersonaChange: (p: string) => void;
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

// 订阅计划类型定义
type SubscriptionPlan = 'weekly' | 'monthly';

interface SubscriptionData {
  isSubscribed: boolean;
  plan: SubscriptionPlan;
  expiry: number;
  startDate: number;
}

export default function ChatUI({ currentPersona, onPersonaChange, theme }: ChatUIProps) {
  // === STATE ===
  const [messages, setMessages] = useState([{ role: 'ai', content: '' }]);
  const [input, setInput] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [typingStatus, setTypingStatus] = useState("Thinking..."); // New State for status text
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === MONETIZATION STATE ===
  const [messageCount, setMessageCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<number | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const FREE_LIMIT = 7; // UPDATED TO 7 STEPS (The Golden Ratio)

  // === Check subscription status on load ===
  useEffect(() => {
    const checkSubscription = () => {
      const savedSubscription = localStorage.getItem('deepSoulSubscription');
      if (savedSubscription) {
        try {
          const data: SubscriptionData = JSON.parse(savedSubscription);
          const now = Date.now();
          
          if (data.isSubscribed && data.expiry && now < data.expiry) {
            setIsSubscribed(true);
            setSubscriptionExpiry(data.expiry);
            setSubscriptionPlan(data.plan);
            
            // 检查是否快到期（剩余时间少于 24 小时）
            const hoursRemaining = (data.expiry - now) / (1000 * 60 * 60);
            if (hoursRemaining < 24 && hoursRemaining > 0) {
              setShowExpiryWarning(true);
            }
          } else {
            // Subscription expired or invalid
            setIsSubscribed(false);
            setSubscriptionExpiry(null);
            setSubscriptionPlan(null);
            localStorage.removeItem('deepSoulSubscription');
          }
        } catch (error) {
          console.error('Error parsing subscription data:', error);
          localStorage.removeItem('deepSoulSubscription');
        }
      }
    };

    checkSubscription();
    
    // 每分钟检查一次是否快到期
    const checkInterval = setInterval(() => {
      const savedSubscription = localStorage.getItem('deepSoulSubscription');
      if (savedSubscription) {
        try {
          const data: SubscriptionData = JSON.parse(savedSubscription);
          const now = Date.now();
          const hoursRemaining = (data.expiry - now) / (1000 * 60 * 60);
          
          if (hoursRemaining < 24 && hoursRemaining > 0 && !showExpiryWarning) {
            setShowExpiryWarning(true);
          } else if (hoursRemaining <= 0) {
            // 订阅已过期
            setIsSubscribed(false);
            setSubscriptionExpiry(null);
            setSubscriptionPlan(null);
            setShowExpiryWarning(false);
            localStorage.removeItem('deepSoulSubscription');
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    }, 60000); // 每分钟检查一次
    
    return () => clearInterval(checkInterval);
  }, [showExpiryWarning]);

  // === 1. INITIAL GREETING ===
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    
    const text = getGreeting(currentPersona);
    setFullText(text);
    
    // Set initial thinking status text
    setTypingStatus(getTypingText(currentPersona));

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) { index++; return text.slice(0, index); }
        clearInterval(intervalId); setIsTyping(false); return prev;
      });
    }, 40);
    return () => clearInterval(intervalId);
  }, [currentPersona]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, displayedText, isTyping]);

  // === 2. SEND HANDLER ===
  const handleSend = () => {
    if (!input.trim()) return;

    // Send User Message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setMessageCount(prev => prev + 1);

    // Prepare AI Reply
    setIsTyping(true); // Show typing indicator again
    setTypingStatus(getTypingText(currentPersona)); // Set custom status text
    
    let nextAiMessage = getNextReply(currentPersona, step);
    setStep(prev => prev + 1);
    
    // Dynamic Delay based on Persona Personality
    const delay = getThinkingTime(currentPersona);
    
    setTimeout(() => {
       setIsTyping(false);
       setMessages(prev => [...prev, { role: 'ai', content: nextAiMessage }]);
    }, delay);
  };

  const isLimitReached = !isSubscribed && messageCount >= FREE_LIMIT;

  // 格式化剩余时间
  const formatTimeRemaining = (expiry: number) => {
    const now = Date.now();
    const diff = expiry - now;
    
    if (diff <= 0) return '已过期';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}天 ${hours}小时`;
    } else if (hours > 0) {
      return `${hours}小时 ${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  };

  // 获取计划显示名称
  const getPlanName = (plan: SubscriptionPlan) => {
    return plan === 'weekly' ? '一周试用' : '一月体验';
  };

  // 清空对话功能
  const handleClearChat = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearChat = () => {
    setIsClearModalOpen(false);
    setIsCleared(true);
    
    // 重新开始对话
    setTimeout(() => {
      setMessages([{ role: 'ai', content: '' }]);
      setStep(0);
      setMessageCount(0);
      setIsCleared(false);
      
      // 重新显示问候语
      let index = 0;
      setDisplayedText('');
      const text = getGreeting(currentPersona);
      setFullText(text);
      setTypingStatus(getTypingText(currentPersona));
      setIsTyping(true);
      
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => {
          if (index < text.length) { index++; return text.slice(0, index); }
          clearInterval(intervalId); setIsTyping(false); return prev;
        });
      }, 40);
    }, 500);
  };

  return (
    <div className={`relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto ${theme.textMain}`}>
      
      <main 
        className="flex-1 overflow-y-auto px-4 md:px-32 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{` main::-webkit-scrollbar { display: none; } `}</style>
        
        <div className="flex flex-col gap-10 pb-4 mt-24">
          
          {/* 会员信息显示 */}
          {isSubscribed && subscriptionExpiry && subscriptionPlan && (
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl px-6 py-3 text-center">
                <div className="flex items-center gap-2 text-amber-200">
                  <span className="text-sm font-medium">
                    {getPlanName(subscriptionPlan)}会员
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="text-sm">
                    剩余时间: {formatTimeRemaining(subscriptionExpiry)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 会员快到期提醒 */}
          {showExpiryWarning && (
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-6 py-3 text-center animate-pulse">
                <div className="flex items-center gap-2 text-red-200">
                  <span className="text-sm font-medium">
                    ⚠️ 您的会员即将在24小时内到期
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* GREETING */}
          <div className="flex w-full justify-center text-center">
            <div className={`max-w-2xl px-8 py-6 rounded-3xl ${theme.container} shadow-2xl`}>
              <p className={`leading-loose text-base md:text-xl font-light tracking-wide ${theme.accent} font-serif`}>
                {displayedText}
                {!displayedText && isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          </div>

          {/* HISTORY */}
          {messages.slice(1).map((msg, idx) => (
             <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${isCleared ? 'opacity-0 transition-opacity duration-500' : 'transition-opacity duration-500'}`}>
                <div
                  className={`
                    px-6 py-4 leading-relaxed shadow-xl backdrop-blur-md text-base md:text-lg animate-in fade-in slide-in-from-bottom-2 max-w-[45%]
                    ${msg.role === 'user'
                      ? `${theme.userMsg} rounded-3xl rounded-tr-sm text-right`
                      : `${theme.aiMsg} rounded-3xl rounded-tl-sm font-serif text-left`
                    }
                  `}
                >
                  {msg.content}
                </div>
             </div>
          ))}

          {/* 清空后的提示语 */}
          {isCleared && (
            <div className="flex w-full justify-center">
              <p className="text-xs text-gray-500 animate-in fade-in slide-in-from-bottom-2">
                Your thoughts have been gently cleared.
              </p>
            </div>
          )}

          {/* TYPING INDICATOR (New Feature) */}
          {isTyping && messages.length > 0 && (
            <div className="flex w-full justify-start animate-pulse">
               <div className={`px-6 py-4 ${theme.container} rounded-3xl rounded-tl-sm text-sm font-serif italic`}>
                 {typingStatus}
               </div>
            </div>
          )}

          {/* PAYWALL TRIGGER */}
          {isLimitReached && (
             <PaywallModal onSubscribe={(plan: SubscriptionPlan) => {
               // Set subscription with expiry based on plan
               const now = Date.now();
               const days = plan === 'weekly' ? 7 : 30;
               const expiry = now + (days * 24 * 60 * 60 * 1000);
               
               localStorage.setItem('deepSoulSubscription', JSON.stringify({
                 isSubscribed: true,
                 plan,
                 expiry,
                 startDate: now
               }));
               
               setIsSubscribed(true);
               setSubscriptionExpiry(expiry);
               setSubscriptionPlan(plan);
               setShowExpiryWarning(false);
             }} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FOOTER */}
      <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isLimitReached ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}>
        <ChatFooter input={input} setInput={setInput} onSend={handleSend} onClearChat={handleClearChat} theme={theme} />
      </div>
      
      {/* 清空对话确认弹窗 */}
      <ClearChatModal 
        isOpen={isClearModalOpen} 
        onClose={() => setIsClearModalOpen(false)} 
        onConfirm={confirmClearChat} 
      />
    </div>
  );
}