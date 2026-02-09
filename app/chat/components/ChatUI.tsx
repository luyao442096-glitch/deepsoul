'use client';

import { useState, useEffect, useRef } from 'react';
import ChatFooter from './ChatFooter';
import PaywallModal from './PaywallModal';
// Import the new advanced logic
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
  const FREE_LIMIT = 7; // UPDATED TO 7 STEPS (The Golden Ratio)

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

  return (
    <div className={`relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto ${theme.textMain}`}>
      
      <main 
        className="flex-1 overflow-y-auto px-4 md:px-32 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{` main::-webkit-scrollbar { display: none; } `}</style>
        
        <div className="flex flex-col gap-10 pb-4 mt-24">
          
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
             <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
             <PaywallModal onSubscribe={() => setIsSubscribed(true)} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FOOTER */}
      <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isLimitReached ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}>
        <ChatFooter input={input} setInput={setInput} onSend={handleSend} theme={theme} />
      </div>
    </div>
  );
}
