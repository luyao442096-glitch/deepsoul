import Link from 'next/link';
import { getCategoryPosts } from '../../../lib/posts';
import type { Metadata } from 'next';
import CategoryPageUI from './CategoryPageUI';

// 辅助函数：标准化匹配 (解决 URL 是 cant-sleep 而数据是 Can't Sleep 的问题)
const normalize = (str: string) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '-') : '';

// 内容配置中心 (SEO 数据源)
const LANDING_CONTENT: Record<string, any> = {
  "burnout": {
    title: "Feeling completely drained?",
    subtitle: "You've been carrying weight of world. It's okay to set it down.",
    color: "bg-cyan-600",
    buttonText: "Start Incubation",
    seoTitle: "Burnout Recovery & Mental Exhaustion Relief",
    seoDesc: "Feeling drained? Discover AI-guided support for work burnout, emotional exhaustion, and chronic stress. Start your healing journey today."
  },
  "cant-sleep": {
    title: "Mind won't shut down?",
    subtitle: "The world is asleep, but you're still running. Let's find your off switch.",
    color: "bg-blue-600",
    buttonText: "Start Incubation",
    seoTitle: "Insomnia Help & Sleep Anxiety Therapy",
    seoDesc: "Can't sleep? Racing thoughts at night? DeepSoul provides immediate, calming guidance to help you fall asleep naturally."
  },
  "invisible": {
    title: "Feeling invisible?",
    subtitle: "Surrounded by people but still alone. I see you.",
    color: "bg-purple-600",
    buttonText: "Start Incubation",
    seoTitle: "Loneliness Support & Emotional Connection",
    seoDesc: "Feeling invisible or isolated? You don't have to be alone. Connect with a soul companion who listens without judgment."
  },
  "spiraling": {
    title: "Thoughts spinning out of control?",
    subtitle: "Anxiety doesn't have to consume you. Let's ground you in the present.",
    color: "bg-teal-600",
    buttonText: "Start Incubation",
    seoTitle: "Anxiety Relief & Spiral Management",
    seoDesc: "Feeling overwhelmed by anxious thoughts? Learn techniques to ground yourself and break the spiral."
  },
  "stuck-in-overwhelm": {
    title: "Stuck in overwhelm?",
    subtitle: "Everything feels too much. Let's take it one step at a time.",
    color: "bg-slate-600",
    buttonText: "Start Incubation",
    seoTitle: "Overwhelm Management & Stress Relief",
    seoDesc: "Feeling stuck under the weight of life? Discover tools to break free and regain control."
  }
};

// 服务器端元数据生成
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

// 服务器端组件
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: currentSlug } = await params;
  
  // 服务器端获取数据
  const categoryPosts = await getCategoryPosts(currentSlug);

  // 获取分类显示的名称 (用于标题)
  const displayTitle = categoryPosts.length > 0 ? categoryPosts[0].category : currentSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // 获取当前分类的内容配置
  const content = LANDING_CONTENT[currentSlug] || LANDING_CONTENT["burnout"];

  return (
    <CategoryPageUI 
      currentSlug={currentSlug}
      categoryPosts={categoryPosts}
      displayTitle={displayTitle}
      content={content}
    />
  );
}