'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, Link } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, MessageSquare, Home, Sparkles, Volume2, Mic } from 'lucide-react';
import PaywallModal from './components/PaywallModal';
import { getGreeting, getNextReply, getThinkingTime, getTypingText } from './lib/chatLogic';
import { useSpeech } from './hooks/useSpeech';

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
  const FREE_LIMIT = 7;

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
        
        // Validate and set the persona
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
      const messagesForAPI = messages.slice(1).concat(newUserMessage);

      // Call the chat API
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

      const data = await response.json();
      
      if (data.content) {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to previous behavior if API fails
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops, network\'s acting up. Mind saying that again, buddy?' }]);
    }
  };

  const isLimitReached = !isSubscribed && messageCount >= FREE_LIMIT;

  // === Quick reply handler ===
  const handleQuickReply = (text: string) => {
    setInput(text);
    handleSend();
  };

  return (
    <div className={`min-h-screen w-full ${theme.bg} ${theme.textMain} flex flex-col md:flex-row`}>
      {/* Breadcrumb Navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#666666] text-sm font-serif">
        <Link href="/dashboard" className="hover:text-[#333333] transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-[#333333]">Chat</span>
      </div>
      
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
              onClick={() => router.push('/dashboard/zen')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]`}
            >
              <Music className="w-5 h-5" />
              <span>Music</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/pet')}
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
        <button onClick={() => router.push('/dashboard/zen')} className="p-2">
          <Music className="w-5 h-5" />
        </button>
        <button onClick={() => router.push('/dashboard/pet')} className="p-2">
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#A67C52]/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className={`p-2 transition-all ${theme.textSub} hover:${theme.textMain}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A67C52] flex items-center justify-center">
                <span className="text-white font-bold">DQ</span>
              </div>
              <div>
                <h1 className="font-semibold">Da Qiang</h1>
                <p className="text-xs text-[#666666]">Northeast Buddy</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-8">
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
              <PaywallModal onSubscribe={() => setIsSubscribed(true)} />
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className={`border-t border-[#A67C52]/30 bg-white px-4 py-3 md:pb-3 pb-16`}>
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Quick Replies */}
            {!isLimitReached && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getQuickReplies(currentPersona).map((reply, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${theme.button}`}
                  >
                    {reply}
                  </button>
                ))}
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
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <ChatContent />;
}