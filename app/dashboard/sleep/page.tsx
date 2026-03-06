'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Lock, CheckCircle, Music, ArrowLeft } from 'lucide-react';
import { Howl } from 'howler';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 订阅计划类型定义
type SubscriptionPlan = 'weekly' | 'monthly';

interface SubscriptionData {
  isSubscribed: boolean;
  plan: SubscriptionPlan;
  expiry: number;
  startDate: number;
}

export default function MusicPage() {
  const router = useRouter();
  // === STATE ===
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<number | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playTime, setPlayTime] = useState(0); // Track play time in seconds
  const [showPaywall, setShowPaywall] = useState(false); // Show paywall modal
  
  // === AUDIO REF ===
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // === MUSIC LIST ===
  const musicList = [
    {
      id: 'one',
      title: 'Track 1',
      src: '/sounds/one.mp3',
      duration: 0, // Will be set dynamically
      unlocked: true // First song is free
    },
    {
      id: 'two',
      title: 'Track 2',
      src: '/sounds/two.mp3',
      duration: 0,
      unlocked: false // Locked until subscription
    },
    {
      id: 'three',
      title: 'Track 3',
      src: '/sounds/three.mp3',
      duration: 0,
      unlocked: false // Locked until subscription
    },
    {
      id: 'four',
      title: 'Track 4',
      src: '/sounds/four.mp3',
      duration: 0,
      unlocked: false // Locked until subscription
    },
    {
      id: 'five',
      title: 'Track 5',
      src: '/sounds/five.mp3',
      duration: 0,
      unlocked: false // Locked until subscription
    }
  ];
  
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
  
  // === UPDATE MUSIC LIST BASED ON SUBSCRIPTION ===
  const updatedMusicList = musicList.map((song, index) => ({
    ...song,
    unlocked: index === 0 || isSubscribed // First song is free, others require subscription
  }));
  
  // === PLAY SOUND ===
  const playSound = (index: number) => {
    const song = updatedMusicList[index];
    
    if (!song.unlocked) {
      // Show paywall modal for locked songs
      setShowPaywall(true);
      return;
    }
    
    // Reset play time when starting a new song
    setPlayTime(0);
    
    // Stop current sound if playing
    if (soundRef.current) {
      soundRef.current.stop();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
    
    // Create new Howl instance
    soundRef.current = new Howl({
      src: [song.src],
      volume: isMuted ? 0 : volume,
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    });
    
    // Play sound
    soundRef.current.play();
    setIsPlaying(true);
    setCurrentSong(index);
    
    // Update progress every 100ms
    progressIntervalRef.current = setInterval(() => {
      if (soundRef.current) {
        const duration = soundRef.current.duration();
        const seek = soundRef.current.seek();
        setProgress((seek / duration) * 100);
        setPlayTime(Math.floor(seek));
        
        // Update song duration
        if (updatedMusicList[index].duration === 0) {
          updatedMusicList[index].duration = duration;
        }
      }
    }, 100);
  };
  
  // === PAUSE SOUND ===
  const pauseSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };
  
  // === RESUME SOUND ===
  const resumeSound = () => {
    if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
      
      // Restart progress interval
      progressIntervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const duration = soundRef.current.duration();
          const seek = soundRef.current.seek();
          setProgress((seek / duration) * 100);
          setPlayTime(Math.floor(seek));
        }
      }, 100);
    }
  };
  
  // === TOGGLE MUTE ===
  const toggleMute = () => {
    if (soundRef.current) {
      if (isMuted) {
        soundRef.current.volume(volume);
      } else {
        soundRef.current.volume(0);
      }
      setIsMuted(!isMuted);
    }
  };
  
  // === ADJUST VOLUME ===
  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (soundRef.current && !isMuted) {
      soundRef.current.volume(newVolume);
    }
  };
  
  // === SKIP TO PREVIOUS ===
  const skipToPrevious = () => {
    const previousIndex = currentSong > 0 ? currentSong - 1 : updatedMusicList.length - 1;
    playSound(previousIndex);
  };
  
  // === SKIP TO NEXT ===
  const skipToNext = () => {
    const nextIndex = currentSong < updatedMusicList.length - 1 ? currentSong + 1 : 0;
    playSound(nextIndex);
  };
  
  // === FORMAT TIME ===
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // === HANDLE PAYMENT SUCCESS ===
  const handlePaymentSuccess = (plan: SubscriptionPlan) => {
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
    setShowPaywall(false);
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
    <div className="min-h-screen bg-[#F8F5F0] text-[#333333] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 bg-[#E8E3DD] border-r border-[#A67C52]/30">
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
              onClick={() => router.push('/dashboard/chat')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Chat</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/sleep')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all bg-[#A67C52] text-white hover:bg-[#8B6541]`}
            >
              <Music className="w-5 h-5" />
              <span>Sleep</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/zen')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4"></path><path d="M15 9a5 5 0 1 0-10 0"/></svg>
              <span>Zen</span>
            </button>
          </nav>
        </div>
        
        <div className="p-6 border-t border-[#A67C52]/30">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-[#D8D3CD]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#A67C52]/30 flex justify-around items-center p-3">
        <button onClick={() => router.push('/dashboard')} className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        </button>
        <button onClick={() => router.push('/dashboard/chat')} className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
        <button onClick={() => router.push('/dashboard/sleep')} className="p-2 text-[#A67C52]">
          <Music className="w-5 h-5" />
        </button>
        <button onClick={() => router.push('/dashboard/zen')} className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4"></path><path d="M15 9a5 5 0 1 0-10 0"/></svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="ml-4 md:ml-4 mt-4 mb-2 flex items-center gap-2 text-[#666666] text-sm font-serif">
          <Link href="/dashboard" className="hover:text-[#333333] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[#333333]">Sleep</span>
        </div>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#A67C52]/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="p-2 transition-all text-[#666666] hover:text-[#333333]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Sleep Music</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
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

            {/* Music Player */}
            <div className="bg-white border border-[#A67C52]/30 rounded-2xl p-6 shadow-sm">
              <div className="space-y-6">
                {/* Album Art Placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-[#A67C52] rounded-xl flex items-center justify-center">
                    <Music className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                {/* Song Title */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{updatedMusicList[currentSong].title}</h2>
                  <p className="text-[#666666] text-sm">Deep Soul Lab</p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#666666]">
                    <span>{formatTime(playTime)}</span>
                    <span>{formatTime(updatedMusicList[currentSong].duration)}</span>
                  </div>
                  <div className="h-2 bg-[#E8E3DD] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#A67C52] rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={skipToPrevious} 
                    className="p-2 text-[#A67C52] hover:bg-[#A67C52]/10 rounded-full"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  {isPlaying ? (
                    <button 
                      onClick={pauseSound} 
                      className="p-3 bg-[#A67C52] text-white rounded-full hover:bg-[#8B6541]"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => playSound(currentSong)} 
                      className="p-3 bg-[#A67C52] text-white rounded-full hover:bg-[#8B6541]"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  )}
                  <button 
                    onClick={skipToNext} 
                    className="p-2 text-[#A67C52] hover:bg-[#A67C52]/10 rounded-full"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleMute} 
                    className="p-2 text-[#A67C52]"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume} 
                    onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-[#E8E3DD] rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #A67C52 0%, #A67C52 ${volume * 100}%, #E8E3DD ${volume * 100}%, #E8E3DD 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Music List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Music Library</h3>
              {updatedMusicList.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${index === currentSong ? 'bg-[#A67C52]/10 border-[#A67C52]/30' : 'bg-white border-[#A67C52]/30 hover:bg-[#F8F5F0]'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#A67C52]/20 flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#A67C52]" />
                    </div>
                    <div>
                      <h4 className="font-medium">{song.title}</h4>
                      <p className="text-xs text-[#666666]">{song.unlocked ? 'Unlocked' : 'Locked'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!song.unlocked && (
                      <Lock className="w-4 h-4 text-[#666666]" />
                    )}
                    <button 
                      onClick={() => playSound(index)}
                      className="p-2 bg-[#A67C52] text-white rounded-full hover:bg-[#8B6541]"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500" />

          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] max-w-md w-full shadow-[0_0_60px_rgba(245,158,11,0.15)] animate-in zoom-in-95 duration-300 overflow-hidden">
            
            {/* Top Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

            <div className="p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-amber-500 mb-2 bg-amber-900/20 px-3 py-1 rounded-full border border-amber-500/20">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs font-medium tracking-wide uppercase">Premium Access</span>
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">
                  Unlock Full Library
                </h3>
                <p className="text-white/50 text-sm">
                  Access all sleep music tracks with a premium subscription.
                </p>
              </div>

              {/* PLAN SELECTION CARDS */}
              <div className="space-y-3 mb-6">
                
                {/* OPTION 1: WEEKLY */}
                <button 
                  onClick={() => handlePaymentSuccess('weekly')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 relative group bg-white/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center border-amber-500">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">Weekly Rescue</p>
                      <p className="text-white/40 text-xs">$0.71 / day</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-serif text-lg">$4.99</p>
                    <p className="text-white/30 text-xs">/ week</p>
                  </div>
                </button>

                {/* OPTION 2: MONTHLY (HIGHLIGHTED) */}
                <button 
                  onClick={() => handlePaymentSuccess('monthly')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 relative bg-gradient-to-r from-amber-900/40 to-black border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                >
                  {/* Badge */}
                  <div className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    BEST VALUE
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center border-amber-500">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">Monthly Healing</p>
                      <p className="text-amber-200/70 text-xs">Save $2.00 vs weekly</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-serif text-xl">$17.99</p>
                    <p className="text-white/30 text-xs">/ month</p>
                  </div>
                </button>

              </div>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowPaywall(false)}
                className="w-full py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}