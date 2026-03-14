'use client';

import { useState } from 'react';
import Modal from './Modal';

interface FooterProps {
  variant?: 'fixed' | 'relative';
}

export default function Footer({ variant = 'fixed' }: FooterProps) {
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const footerClasses = variant === 'fixed' 
    ? "fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#050A18] to-transparent py-4"
    : "relative w-full bg-white border-t border-[#A67C52]/30 py-3 mt-4";
  
  const buttonClasses = variant === 'fixed'
    ? "text-xs md:text-sm text-[#6b7280] hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
    : "text-xs md:text-sm text-[#666666] hover:text-[#333333] transition-colors duration-200 bg-transparent border-none cursor-pointer";
  
  const separatorClasses = variant === 'fixed' ? "text-[#6b7280]" : "text-[#A67C52]/50";

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
        <div className="space-y-4 text-sm text-white/90 leading-relaxed">
          <p>
            Welcome to Zlseren. By accessing our platform, you agree to the following core terms:
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-white mb-1">Age Requirement:</h3>
              <p className="text-white/80">You confirm you are 18 years of age or older.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-1">Not Medical Advice:</h3>
              <p className="text-white/80">Zlseren provides AI-driven emotional companionship. It is not a clinical therapy service and cannot diagnose, treat, or cure mental health conditions.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-1">Appropriate Use:</h3>
              <p className="text-white/80">You agree to interact respectfully and not use the service to generate illegal, harmful, or malicious content.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-1">Liability:</h3>
              <p className="text-white/80">Your use of the service is at your own risk. Zlseren is not liable for personal decisions or actions taken based on these interactions.</p>
            </div>
          </div>
          
          <p className="pt-2">
            For our complete Terms of Service, please contact us.
          </p>
        </div>
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

      <footer className={footerClasses}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            <button
              onClick={() => setIsMedicalModalOpen(true)}
              className={buttonClasses}
            >
              Medical Disclaimer
            </button>
            <span className={separatorClasses}>•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className={buttonClasses}
            >
              Privacy & Data Deletion
            </button>
            <span className={separatorClasses}>•</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className={buttonClasses}
            >
              Terms of Service
            </button>
            <span className={separatorClasses}>•</span>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className={buttonClasses}
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}