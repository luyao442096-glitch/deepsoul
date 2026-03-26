import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050A18] to-[#081530] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="text-center max-w-2xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
          Feeling a bit lost?
        </h1>
        <p className="text-lg text-white/60 mb-12 leading-relaxed">
          The page you're looking for doesn't exist, but you are exactly where you need to be.
        </p>
        
        {/* 核心转化按钮 */}
        <Link 
          href="/invisible/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600/40 to-purple-600/40 hover:from-indigo-600/50 hover:to-purple-600/50 transition-all border border-white/30 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 mb-8"
        >
          <span className="text-base font-medium">👉 Take the 1-Minute AI Chat Test to Clear Your Mind</span>
        </Link>
        
        {/* 底部链接 */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}