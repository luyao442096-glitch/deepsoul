'use client';

import { useEffect } from 'react';

interface ClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearChatModal({ isOpen, onClose, onConfirm }: ClearChatModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div 
        className="relative bg-gradient-to-br from-[#0A1525] to-[#050A18] rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
          Ready to let these thoughts go?
        </h2>

        <p className="text-gray-300 leading-relaxed text-center mb-8">
          Once cleared, this conversation will be permanently deleted and Haru will start fresh with you. It's okay to let go.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200 font-medium"
          >
            Keep them
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Yes, clear my mind
          </button>
        </div>
      </div>
    </div>
  );
}