'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeepZenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Video Section */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <video 
          src="/videos/WeChat.mp4" 
          autoPlay 
          loop 
          playsInline
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}