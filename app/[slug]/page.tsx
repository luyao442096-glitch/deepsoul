import React, { use } from 'react';
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

// --- 1. 内容配置中心 (SEO 数据源) ---
const LANDING_CONTENT: Record<string, any> = {
  "burnout": {
    title: "Feeling completely drained?",
    subtitle: "You've been carrying the weight of the world. It's okay to set it down.",
    color: "bg-cyan-600",
    buttonText: "Start Incubation",
    // 关键 SEO 信息
    seoTitle: "Burnout Recovery & Mental Exhaustion Relief",
    seoDesc: "Feeling drained? Discover AI-guided support for work burnout, emotional exhaustion, and chronic stress. Start your healing journey today."
  },
  "insomnia": {
    title: "Mind won't shut down?",
    subtitle: "The world is asleep, but you're still running. Let's find your off switch.",
    color: "bg-blue-600",
    buttonText: "Start Incubation",
    seoTitle: "Insomnia Help & Sleep Anxiety Therapy",
    seoDesc: "Can't sleep? Racing thoughts at night? DeepSoul provides immediate, calming guidance to help you fall asleep naturally."
  },
  "anxiety": {
    title: "Chest feeling heavy?",
    subtitle: "That tightness isn't permanent. Breathe with me, just for a moment.",
    color: "bg-emerald-600",
    buttonText: "Start Incubation",
    seoTitle: "Anxiety Relief & Panic Attack Support",
    seoDesc: "Immediate help for chest tightness, panic attacks, and social anxiety. Breathe with our AI companion to find calm."
  },
  "loneliness": {
    title: "Feeling invisible?",
    subtitle: "Surrounded by people but still alone. I see you.",
    color: "bg-purple-600",
    buttonText: "Start Incubation",
    seoTitle: "Loneliness Support & Emotional Connection",
    seoDesc: "Feeling invisible or isolated? You don't have to be alone. Connect with a soul companion who listens without judgment."
  },
  "relationships": { 
    title: "Heart heavy?",
    subtitle: "Love, loss, or confusion. Let's unpack it gently.",
    color: "bg-rose-600",
    buttonText: "Start Incubation",
    seoTitle: "Relationship Advice & Heartbreak Healing",
    seoDesc: "Navigating a breakup or toxic relationship? Find clarity and comfort for your heavy heart."
  },
  "focus": { 
    title: "Stuck in the loop?",
    subtitle: "Procrastination isn't laziness. It's fear.",
    color: "bg-amber-600",
    buttonText: "Start Incubation",
    seoTitle: "Focus Tools & ADHD Procrastination Help",
    seoDesc: "Stop the procrastination loop. Gentle, non-judgmental strategies to help you focus and get unstuck."
  }
};

// --- 2. 新增：动态生成 SEO 元数据 (Head Tags) ---
// 这会让浏览器标签页变成 "Insomnia Help | DeepSoul" 这样的格式
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = LANDING_CONTENT[slug] || LANDING_CONTENT["burnout"];
  
  return {
    title: `${content.seoTitle} | DeepSoul`,
    description: content.seoDesc,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDesc,
      type: 'website',
    },
  };
}

// --- 3. 页面组件 (保持图1发光风格) ---
export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  // 默认 fallback
  const content = LANDING_CONTENT[slug] || LANDING_CONTENT["burnout"];

  return (
    <main className="min-h-screen bg-[#050A18] text-slate-200 flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* 这里的隐藏文本依然保留，作为双重保险 */}
      <div className="sr-only">
        <h1>{content.seoTitle}</h1>
        <p>{content.seoDesc}</p>
        <article>
          <h2>{content.title}</h2>
          <p>{content.subtitle}</p>
        </article>
      </div>

      {/* 320px 聚焦光球 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] ${content.color} rounded-full blur-[90px] opacity-40 animate-pulse-slow pointer-events-none`}></div>

      <div className="z-10 max-w-2xl text-center space-y-10 animate-fade-in-up">
        {/* 标题：衬线体，大字号 */}
        <h2 className="text-5xl md:text-6xl font-serif text-white tracking-wide leading-tight drop-shadow-2xl">
          {content.title}
        </h2>
        
        {/* 副标题：轻盈的无衬线体 */}
        <p className="text-xl text-slate-300/80 font-light leading-relaxed max-w-lg mx-auto">
          {content.subtitle}
        </p>

        <div className="pt-8">
          {/* 链接指向嵌套的测试页 */}
          <Link href={`/${slug}/onboarding`}> 
            <button className="group relative px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
              <span className="text-sm tracking-[0.2em] uppercase text-white/90 group-hover:text-white flex items-center gap-3">
                {content.buttonText} <ArrowRight className="w-4 h-4 opacity-70" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}