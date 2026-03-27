'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, MessageSquare, Home, Sparkles, Volume2, Mic } from 'lucide-react';
import PaywallModal from './components/PaywallModal';
import ClearChatModal from './components/ClearChatModal';
import { getGreeting, getNextReply, getThinkingTime, getTypingText } from './lib/chatLogic';
import { useSpeech } from './hooks/useSpeech';

// 订阅计划类型定义
type SubscriptionPlan = 'weekly' | 'monthly';

interface SubscriptionData {
  isSubscribed: boolean;
  plan: SubscriptionPlan;
  expiry: number;
  startDate: number;
}

// New theme configuration
const theme = {
  bg: "bg-[#F8F5F0]",
  container: "bg-white border-[#A67C52]/30 shadow-sm",
  textMain: "text-[#333333]",
  textSub: "text-[#666666]",
  inputBg: "bg-white border border-[#A67C52]/50 focus:ring-[#A67C52]/50",
  userMsg: "bg-[#E8E3DD] text-[#333333] rounded-2xl rounded-tr-none",
  aiMsg: "bg-[#A67C52] text-white rounded-2xl rounded-tl-none",
  accent: "text-[#A67C52]",
  sidebar: "bg-[#E8E3DD] border-r border-[#A67C52]/30",
  button: "bg-[#A67C52] text-white hover:bg-[#8B6541] transition-colors"
};

// Get quick replies based on persona
const getQuickReplies = (persona: string) => {
  switch (persona) {
    case 'insomnia':
      return ['Again?', 'Try breathing', 'Chat'];
    case 'stress':
      return ['Need a break', 'Work is tough', 'Chat'];
    case 'loneliness':
      return ['Feel alone', 'Need company', 'Chat'];
    default:
      return ['How are you?', 'What\'s up?', 'Chat'];
  }
};

function ChatContent() {
  const router = useRouter();
  const [currentPersona, setCurrentPersona] = useState('stress'); // Default to 'Stress' for testing
  
  // === STATE ===
  const [messages, setMessages] = useState([{ role: 'ai', content: '' }]);
  const [input, setInput] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [typingStatus, setTypingStatus] = useState("Thinking...");
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === MONETIZATION STATE ===
  const [messageCount, setMessageCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<number | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const FREE_LIMIT = 7;

  // === CLEAR CHAT STATE ===
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

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

  // === SIDEBAR STATE ===
  const [activeTab, setActiveTab] = useState('chat');

  // === SPEECH HOOK ===
  const { isSpeaking, isListening, transcript, speak, startListening, stopListening } = useSpeech();

  // === Get persona from user database ===
  useEffect(() => {
    // Simulate API call to get user's test result from database
    const fetchUserTestResult = async () => {
      try {
        // In a real app, this would be an API call to your backend or Supabase
        // For now, we'll simulate it with a timeout and return a default value
        // Replace this with actual API call when database is set up
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate getting test result from database
        // For testing purposes, we'll use 'Stress' as the default
        const testResult = 'Stress'; // This would come from your database
        
        // Convert to lowercase for consistency with existing code
        const normalizedResult = testResult.toLowerCase();
        
        // Validate and set persona
        if (['insomnia', 'stress', 'loneliness'].includes(normalizedResult)) {
          setCurrentPersona(normalizedResult);
        }
      } catch (error) {
        console.error('Error fetching user test result:', error);
        // Fall back to default if there's an error
        setCurrentPersona('stress');
      }
    };

    fetchUserTestResult();
  }, []);

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
  const handleSend = async () => {
    if (!input.trim()) return;

    // Send User Message
    const newUserMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setMessageCount(prev => prev + 1);

    // Prepare AI Reply
    setIsTyping(true);
    setTypingStatus(getTypingText(currentPersona));

    try {
      // Build complete messages array including history
      // 直接使用当前消息和新消息，确保使用最新的消息
      const messagesForAPI = [...messages.slice(1), newUserMessage];
      console.log('Messages sent to API:', messagesForAPI);

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userState: currentPersona,
          messages: messagesForAPI
        })
      });

      console.log('API Response Status:', response.status);
      
      // 检查响应是否有效
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
      
      // 确保content存在且为字符串
      if (data && typeof data === 'object' && 'content' in data && typeof data.content === 'string') {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
        console.log('Added message:', data.content);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to previous behavior if API fails
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops, network\'s acting up. Mind saying that again, buddy?' }]);
      console.log('Added error fallback message');
    }
  };

  const isLimitReached = !isSubscribed && messageCount >= FREE_LIMIT;

  // === Quick reply handler ===
  const handleQuickReply = (text: string) => {
    setInput(text);
    handleSend();
  };

  // === Clear chat handler ===
  const handleClearChat = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearChat = () => {
    setIsClearModalOpen(false);
    // Reset chat to initial state
    setMessages([{ role: 'ai', content: '' }]);
    setStep(0);
    setMessageCount(0);
    
    // Restart greeting animation
    let index = 0;
    setDisplayedText('');
    const text = getGreeting(currentPersona);
    setFullText(text);
    setTypingStatus(getTypingText(currentPersona));
    setIsTyping(true);
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          index++;
          return text.slice(0, index);
        }
        clearInterval(intervalId);
        setIsTyping(false);
        return prev;
      });
    }, 40);
  };

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

  return (
    <div className={`min-h-screen w-full ${theme.bg} ${theme.textMain} flex flex-col md:flex-row`}>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 ${theme.sidebar}">
        <div className="p-6 border-b border-[#A67C52]/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#A67C52] flex items-center justify-center">
              <span className="text-white font-bold text-xl">DQ</span>
            </div>
            <div>
              <h2 className="font-semibold">Da Qiang</h2>
              <p className="text-xs text-[#666666]">Northeast Buddy</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'chat' ? theme.button : 'hover:bg-[#D8D3CD]'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/sleep')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]`}
            >
              <Music className="w-5 h-5" />
              <span>Music</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/zen')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Zen</span>
            </button>
          </nav>
        </div>
        
        <div className="p-6 border-t border-[#A67C52]/30">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#A67C52]/30 flex justify-around items-center p-3">
        <button onClick={() => router.push('/dashboard')} className="p-2">
          <Home className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('chat')} className={`p-2 ${activeTab === 'chat' ? theme.accent : ''}`}>
          <MessageSquare className="w-5 h-5" />
        </button>
        <button onClick={() => router.push('/dashboard/sleep')} className="p-2">
          <Music className="w-5 h-5" />
        </button>
        <button onClick={() => router.push('/dashboard/zen')} className="p-2">
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="ml-4 md:ml-4 mt-4 mb-2 flex items-center gap-2 text-[#666666] text-sm font-serif">
          <Link href="/dashboard" className="hover:text-[#333333] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[#333333]">Chat</span>
        </div>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#A67C52]/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className={`p-2 transition-all ${theme.textSub} hover:${theme.textMain}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Chat</h1>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* 会员信息显示 */}
            {isSubscribed && subscriptionExpiry && subscriptionPlan && (
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl px-6 py-3 text-center">
                  <div className="flex items-center gap-2 text-amber-600">
                    <span className="text-sm font-medium">
                      {getPlanName(subscriptionPlan)}会员
                    </span>
                    <span className="text-gray-400">|</span>
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
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="text-sm font-medium">
                      ⚠️ 您的会员即将在24小时内到期
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Greeting */}
            <div className="flex w-full justify-start">
              <div className={`px-6 py-4 rounded-2xl ${theme.aiMsg} shadow-md`}>
                <div className="flex items-start gap-2">
                  <p className="leading-relaxed text-base font-light">
                    {displayedText}
                    {!displayedText && isTyping && <span className="animate-pulse">|</span>}
                  </p>
                  {displayedText && (
                    <button 
                      onClick={() => speak(displayedText)}
                      className={`ml-2 flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors ${isSpeaking ? 'text-white' : 'text-white/70'}`}
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Message History */}
            {messages.slice(1).map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-6 py-4 leading-relaxed shadow-md max-w-[70%] ${msg.role === 'user' ? theme.userMsg : theme.aiMsg}`}>
                  <div className="flex items-start gap-2">
                    <span>{msg.content}</span>
                    {msg.role === 'ai' && (
                      <button 
                        onClick={() => speak(msg.content)}
                        className={`ml-2 flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors ${isSpeaking ? 'text-white' : 'text-white/70'}`}
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && messages.length > 0 && (
              <div className="flex w-full justify-start">
                <div className={`px-6 py-4 ${theme.container} rounded-2xl rounded-tl-none text-sm italic`}>
                  {typingStatus}
                </div>
              </div>
            )}

            {/* Paywall Trigger */}
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

        {/* Input Area */}
        <div className={`border-t border-[#A67C52]/30 bg-white px-4 py-3 md:pb-3 pb-16`}>
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Quick Replies */}
            {!isLimitReached && (
              <div className="flex gap-2 overflow-x-auto pb-2 items-center">
                {getQuickReplies(currentPersona).map((reply, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${theme.button}`}
                  >
                    {reply}
                  </button>
                ))}
                <button
                  onClick={handleClearChat}
                  className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-transparent border border-[#A67C52]/50 text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors"
                >
                  Clear my mind
                </button>
              </div>
            )}

            {/* Input Box */}
            <div className={`flex items-center gap-3 ${theme.inputBg} rounded-full p-2`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Just chat..."
                className={`flex-1 bg-transparent border-none ${theme.textMain} px-4 py-2 focus:outline-none placeholder:${theme.textSub} font-light text-base`}
              />
              <button 
                onClick={() => startListening((text) => setInput(text))}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-[#A67C52] hover:bg-[#A67C52]/10'}`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend} 
                className={`p-2 rounded-full ${theme.button}`}
                disabled={isLimitReached}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
        
        {/* Clear Chat Modal */}
        <ClearChatModal 
          isOpen={isClearModalOpen} 
          onClose={() => setIsClearModalOpen(false)} 
          onConfirm={confirmClearChat}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <ChatContent />;
}