import { useState, useCallback, useEffect } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Text-to-Speech function
  const speak = useCallback((text: string) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties for a deeper, masculine tone (Northeast buddy vibe)
    utterance.pitch = 0.85; // Lower pitch for deeper voice
    utterance.rate = 1.1; // Slightly faster for natural flow
    
    // Try to find a male voice
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('daniel') ||
      voice.name.toLowerCase().includes('james')
    );
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Speech-to-Text function
  const startListening = useCallback(async (onResult: (text: string) => void) => {
    if (typeof window === 'undefined') {
      alert('Speech recognition is not available in this environment.');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    // Check for microphone permission
    if ('navigator' in window && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error('Microphone permission error:', error);
        alert('Microphone permission is required for voice input. Please allow microphone access in your browser settings.');
        return;
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Provide user-friendly error messages
      if (event.error === 'not-allowed') {
        alert('Microphone permission is required. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        // No need to alert for no speech
      } else {
        alert('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      alert('Failed to start voice input. Please check your microphone settings.');
    }
  }, []);

  // Stop listening function
  const stopListening = useCallback(() => {
    // Recognition stops automatically when user stops speaking
    setIsListening(false);
  }, []);

  // Load voices when available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  return {
    isSpeaking,
    isListening,
    transcript,
    speak,
    startListening,
    stopListening
  };
}