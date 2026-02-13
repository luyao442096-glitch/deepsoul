import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050A18] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl md:text-9xl font-serif mb-6 text-white/20">404</h1>
        <h2 className="text-3xl md:text-4xl font-light mb-6">
          Page Not Found
        </h2>
        <p className="text-white/60 mb-12 text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's help you find what you need.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </Link>
          
          <Link 
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600/30 hover:bg-indigo-600/40 transition-all border border-indigo-500/30"
          >
            <Search className="w-5 h-5" />
            <span>Take Quiz</span>
          </Link>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">Popular Categories</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/category/burnout" className="text-sm text-white/60 hover:text-white transition-colors">
              Burnout
            </Link>
            <Link href="/category/cant-sleep" className="text-sm text-white/60 hover:text-white transition-colors">
              Can't Sleep
            </Link>
            <Link href="/category/invisible" className="text-sm text-white/60 hover:text-white transition-colors">
              Invisible
            </Link>
            <Link href="/category/spiraling" className="text-sm text-white/60 hover:text-white transition-colors">
              Spiraling
            </Link>
            <Link href="/category/stuck-in-overwhelm" className="text-sm text-white/60 hover:text-white transition-colors">
              Stuck in Overwhelm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}