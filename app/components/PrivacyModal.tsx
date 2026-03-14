'use client';

import { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
        className="relative bg-gradient-to-br from-[#0A1525] to-[#050A18] rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-2xl border border-white/10"
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

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Privacy & Data Deletion
        </h2>

        <div className="space-y-4 text-gray-200 leading-relaxed">
          <p className="text-white/90">
            Your thoughts belong to you. We do not use your personal conversations to train public AI models, nor do we sell your data to third parties.
          </p>

          <p className="text-white/90">
            You have absolute right to delete your data. You can clear your chat history at any time, or permanently delete your account and all associated data in your Account Settings.
          </p>

          <p className="text-white/90">
            If you have any questions about your privacy or wish to exercise your data rights, please contact our Data Protection Officer directly at:{' '}
            <a 
              href="mailto:luyao442096@gmail.com"
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
            >
              luyao442096@gmail.com
            </a>
          </p>

          <p className="text-white/90">
            We are here to protect your peace.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}