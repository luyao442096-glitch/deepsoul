'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Lock, CheckCircle, Music, ArrowLeft } from 'lucide-react';
import { Howl } from 'howler';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MusicPage() {
  const router = useRouter();
  // === STATE ===
  const [isSubscribed, setIsSubscribed] = useState(false);
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
  
  // === LOAD SUBSCRIPTION STATUS ===
  useEffect(() => {
    // Load subscription status from localStorage
    const savedSubscription = localStorage.getItem('isSubscribed');
    if (savedSubscription) {
      setIsSubscribed(JSON.parse(savedSubscription));
    }
  }, []);
  
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
      onplay: () => {
        setIsPlaying(true);
        setCurrentSong(index);
        
        // Start progress update interval
        progressIntervalRef.current = setInterval(() => {
          if (soundRef.current) {
            const seek = soundRef.current.seek();
            const duration = soundRef.current.duration();
            setProgress((seek / duration) * 100);
            
            // Track play time for first song (free trial)
            if (index === 0 && !isSubscribed) {
              setPlayTime(Math.floor(seek));
              // Check if 10 minutes (600 seconds) reached
              if (Math.floor(seek) >= 600) {
                soundRef.current?.stop();
                setShowPaywall(true);
              }
            }
          }
        }, 100);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        // Auto play next song if subscribed
        if (isSubscribed) {
          const nextIndex = (index + 1) % updatedMusicList.length;
          playSound(nextIndex);
        }
      }
    });
    
    // Play the sound
    soundRef.current.play();
  };
  
  // === TOGGLE PLAY/PAUSE ===
  const togglePlayPause = () => {
    if (!soundRef.current) {
      // If no sound is loaded, play the current song
      playSound(currentSong);
      return;
    }
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  // === SKIP TO PREVIOUS SONG ===
  const skipPrevious = () => {
    if (!isSubscribed && currentSong > 0) {
      // If not subscribed, can only play first song
      return;
    }
    const prevIndex = (currentSong - 1 + updatedMusicList.length) % updatedMusicList.length;
    playSound(prevIndex);
  };
  
  // === SKIP TO NEXT SONG ===
  const skipNext = () => {
    if (!isSubscribed) {
      // If not subscribed, can only play first song
      return;
    }
    const nextIndex = (currentSong + 1) % updatedMusicList.length;
    playSound(nextIndex);
  };
  
  // === HANDLE PROGRESS BAR CLICK ===
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!soundRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const duration = soundRef.current.duration();
    const seekTime = duration * percentage;
    
    soundRef.current.seek(seekTime);
    setProgress(percentage * 100);
  };
  
  // === HANDLE VOLUME CHANGE ===
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };
  
  // === TOGGLE MUTE ===
  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundRef.current.volume(newMuted ? 0 : volume);
  };
  
  // === TOGGLE SUBSCRIPTION ===
  const toggleSubscription = () => {
    const newSubscription = !isSubscribed;
    setIsSubscribed(newSubscription);
    localStorage.setItem('isSubscribed', JSON.stringify(newSubscription));
  };
  
  // === CLEANUP ===
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // === FORMAT TIME ===
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="min-h-screen w-full bg-[#F8F5F0] text-[#333333] flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#666666] text-sm font-serif">
        <Link href="/dashboard" className="hover:text-[#333333] transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-[#333333]">Sleep</span>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#A67C52]/30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-full transition-all hover:bg-gray-100"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-[#666666]" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A67C52] flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold">Music Sanctuary</h1>
                <p className="text-xs text-[#666666]">Your personalized soundscape</p>
              </div>
            </div>
          </div>
          
          {/* Subscription Status */}
          <button
            onClick={toggleSubscription}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              isSubscribed
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
          >
            {isSubscribed ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Subscribed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Subscribe</span>
              </div>
            )}
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mx-auto mb-4"
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-serif font-bold mb-2">Find Your Flow</h2>
          <p className="text-[#666666] max-w-2xl mx-auto">
            Curated soundscapes to help you relax, focus, and sleep better.
            {!isSubscribed && ' First track is free for 10 minutes. Subscribe to unlock all tracks.'}
          </p>
        </motion.div>
        
        {/* Music List */}
        <div className="space-y-4 mb-12">
          {updatedMusicList.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                index === currentSong
                  ? 'bg-amber-50 border-amber-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => playSound(index)}
                    disabled={!song.unlocked}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      !song.unlocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : index === currentSong && isPlaying
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    }`}
                  >
                    {!song.unlocked ? (
                      <Lock className="w-5 h-5" />
                    ) : index === currentSong && isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  
                  <div>
                    <h3 className={`font-medium ${
                      !song.unlocked ? 'text-gray-400' : ''
                    }`}>
                      {song.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {!song.unlocked && 'Locked - Subscribe to unlock'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {index === currentSong && soundRef.current
                    ? formatTime(soundRef.current.seek())
                    : '--:--'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Player Controls */}
        <div className="bg-white rounded-2xl border border-[#A67C52]/30 shadow-sm p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {soundRef.current ? formatTime(soundRef.current.seek()) : '0:00'}
              </span>
              <span className="text-sm text-gray-500">
                {soundRef.current ? formatTime(soundRef.current.duration()) : '0:00'}
              </span>
            </div>
            <div
              onClick={handleProgressClick}
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow-sm"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)', top: '-3px' }}
              />
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={skipPrevious}
              disabled={!isSubscribed && currentSong === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                (!isSubscribed && currentSong === 0)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
              }`}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            
            <button
              onClick={skipNext}
              disabled={!isSubscribed}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                !isSubscribed
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
              }`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-amber-600 hover:text-amber-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #F59E0B ${(isMuted ? 0 : volume) * 100}%, #E5E7EB ${(isMuted ? 0 : volume) * 100}%)`
              }}
            />
          </div>
        </div>
      </main>
      
      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Unlock All Tracks</h3>
              <p className="text-gray-600 mb-6">
                {currentSong === 0 && !isSubscribed
                  ? "Your free trial has ended. Subscribe to continue listening."
                  : "Subscribe to unlock all music tracks and enjoy unlimited listening."}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSubscribed(true);
                    localStorage.setItem('isSubscribed', JSON.stringify(true));
                    setShowPaywall(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Subscribe Now
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Music Sanctuary © 2024</p>
          <p className="mt-1">Curated soundscapes for your well-being</p>
        </div>
      </footer>
    </div>
  );
}