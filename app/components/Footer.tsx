'use client';

import { useState } from 'react';
import Link from 'next/link';
import PrivacyModal from './PrivacyModal';

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#050A18] to-transparent py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            <Link 
              href="/medical-disclaimer"
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200"
            >
              Medical Disclaimer
            </Link>
            <span className="text-[#6b7280]">•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Privacy & Data Deletion
            </button>
            <span className="text-[#6b7280]">•</span>
            <Link 
              href="/terms"
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-[#6b7280]">•</span>
            <Link 
              href="/contact"
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}