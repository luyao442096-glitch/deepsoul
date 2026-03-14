'use client';

import { useState } from 'react';
import Modal from './Modal';

export default function Footer() {
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      {/* Medical Disclaimer Modal */}
      <Modal 
        isOpen={isMedicalModalOpen} 
        onClose={() => setIsMedicalModalOpen(false)} 
        title="Medical Disclaimer"
      >
        <p className="text-white/90">
          Disclaimer: DeepSoulLab is designed to provide emotional support and a safe space for reflection. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis, please reach out to a professional immediately.
        </p>
      </Modal>

      {/* Privacy & Data Deletion Modal */}
      <Modal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
        title="Privacy & Data Deletion"
      >
        <p className="text-white/90">
          Your thoughts belong to you. We do not use your personal conversations to train public AI models, nor do we sell your data to third parties. You have the absolute right to delete your data. You can clear your chat history at any time, or permanently delete your account and all associated data in your Account Settings. If you have any questions, contact us at:{' '}
          <a 
            href="mailto:luyao442096@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
          >
            luyao442096@gmail.com
          </a>
        </p>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
        title="Terms of Service"
      >
        <p className="text-white/90">
          Terms of Service content coming soon.
        </p>
      </Modal>

      {/* Contact Us Modal */}
      <Modal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        title="Contact Us"
      >
        <p className="text-white/90">
          Contact us at:{' '}
          <a 
            href="mailto:luyao442096@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
          >
            luyao442096@gmail.com
          </a>
        </p>
      </Modal>

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#050A18] to-transparent py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            <button
              onClick={() => setIsMedicalModalOpen(true)}
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Medical Disclaimer
            </button>
            <span className="text-[#6b7280]">•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Privacy & Data Deletion
            </button>
            <span className="text-[#6b7280]">•</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-[#6b7280]">•</span>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}