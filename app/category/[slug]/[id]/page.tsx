import { use } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPostData, getCategoryPosts } from '../../../../lib/posts';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

// 生成动态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; id: string }> }
): Promise<Metadata> {
  const { slug, id } = await params;
  const post = await getPostData(slug, id);
  
  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

// 状态选项数据 - 与首页一致
const stateOptions = [
  {
    id: 'burnout',
    label: 'Burnout',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-700/40',
    shadow: 'shadow-[0_0_15px_rgba(146,64,14,0.4)]',
    hoverBg: 'bg-amber-800/40',
    hoverShadow: 'shadow-[0_0_25px_rgba(146,64,14,0.6)]',
    description: 'Feeling exhausted and overwhelmed',
    href: '/category/burnout'
  },
  {
    id: 'cant-sleep',
    label: 'Can\'t Sleep',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-700/40',
    shadow: 'shadow-[0_0_15px_rgba(30,64,175,0.4)]',
    hoverBg: 'bg-blue-800/40',
    hoverShadow: 'shadow-[0_0_25px_rgba(30,64,175,0.6)]',
    description: 'Insomnia or sleep disturbances',
    href: '/category/cant-sleep'
  },
  {
    id: 'invisible',
    label: 'Invisible',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-700/40',
    shadow: 'shadow-[0_0_15px_rgba(91,33,182,0.4)]',
    hoverBg: 'bg-purple-800/40',
    hoverShadow: 'shadow-[0_0_25px_rgba(91,33,182,0.6)]',
    description: 'Feeling unseen or unheard',
    href: '/category/invisible'
  },
  {
    id: 'spiraling',
    label: 'Spiraling',
    bgColor: 'bg-teal-900/30',
    borderColor: 'border-teal-700/40',
    shadow: 'shadow-[0_0_15px_rgba(17,94,89,0.4)]',
    hoverBg: 'bg-teal-800/40',
    hoverShadow: 'shadow-[0_0_25px_rgba(17,94,89,0.6)]',
    description: 'Anxious thoughts and worry',
    href: '/category/spiraling'
  },
  {
    id: 'stuck-in-overwhelm',
    label: 'Stuck in Overwhelm',
    bgColor: 'bg-slate-800/30',
    borderColor: 'border-slate-600/40',
    shadow: 'shadow-[0_0_15px_rgba(51,65,85,0.4)]',
    hoverBg: 'bg-slate-700/40',
    hoverShadow: 'shadow-[0_0_25px_rgba(51,65,85,0.6)]',
    description: 'Unable to move forward',
    href: '/category/stuck-in-overwhelm'
  }
];

// 服务器端组件
export default function ArticlePage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params);
  const post = use(getPostData(slug, id));
  const relatedPosts = use(getCategoryPosts(slug).then(posts => 
    posts.filter(p => p.slug !== id).slice(0, 3)
  ));
  
  if (!post) {
    return (
      <main className="min-h-screen bg-[#050A18] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Article Not Found</h1>
          <Link href={`/category/${slug}`} className="text-blue-400 hover:text-blue-300">
            Back to {slug.replace(/-/g, ' ')}
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050A18] to-[#081530] text-white relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      
      {/* --- 第一屏：首页样式 --- */}
      <div className="min-h-screen relative z-10">
        {/* 第一屏：主内容 */}
        <div className="z-10 min-h-screen flex flex-col items-center justify-center px-6 relative">
          {/* 标题 */}
          <h1 
            className="text-4xl md:text-5xl font-serif mb-8 leading-tight"
          >
            How is your energy?
          </h1>
          
          {/* 副标题 */}
          <p 
            className="text-lg text-white/60 mb-16"
          >
            Select light that resonates with you.
          </p>
          
          {/* 发光球体网格 */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 max-w-3xl mx-auto"
          >
            {stateOptions.map((option, index) => (
              <div
                key={option.id}
                className="flex flex-col items-center gap-4"
              >
                <Link href={option.href}>
                  <button
                    className={`w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-full ${option.bgColor} border border-white/10 ${option.borderColor} ${option.shadow} hover:${option.hoverBg} hover:${option.hoverShadow} transition-all duration-500 ease-in-out flex items-center justify-center backdrop-blur-sm relative overflow-hidden group cursor-pointer`}
                  >
                    {/* 内部文字标签 */}
                    <span className="text-sm sm:text-base font-medium text-white text-center px-3 z-10 group-hover:text-white/90 transition-colors duration-300">
                      {option.label}
                    </span>
                    {/* 光圈效果 */}
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* --- 第二屏：文章内容 --- */}
      <section className="relative z-10 py-20">
        {/* 面包屑导航 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.deepsoullab.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": post.category,
                  "item": `https://www.deepsoullab.com/category/${slug}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": `https://www.deepsoullab.com/category/${slug}/${id}`
                }
              ]
            })
          }}
        />
        <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-6 mb-8">
          <ol className="flex items-center space-x-2 text-xs text-white/40 uppercase tracking-widest">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/category/${slug}`} className="hover:text-white transition-colors">
                {post.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="text-white truncate max-w-[200px]">{post.title}</span>
            </li>
          </ol>
        </nav>
        
        {/* 文章内容 */}
        <div className="max-w-4xl mx-auto px-6">
          {/* 文章标题和元信息 */}
          <div 
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
              {post.title}
            </h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-white/40 mb-8">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            
            {/* 文章描述（作为摘要） */}
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {post.description}
            </p>
          </div>
          
          {/* 文章正文 */}
          <div 
            className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-white/10 transition-all duration-500"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-5 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg md:text-xl font-medium mt-8 mb-4 text-white">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-6 text-gray-200 leading-relaxed">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-blue-400 hover:text-blue-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-6 text-gray-200 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-6 text-gray-200 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="pl-2 leading-relaxed">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-500 pl-6 py-4 my-8 italic text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-white/10 px-2 py-1 rounded text-sm text-blue-300 font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-white/5 p-6 rounded-lg overflow-x-auto mb-8 font-mono text-sm">
                      <code className="text-blue-300">
                        {children}
                      </code>
                    </pre>
                  ),
                  hr: () => (
                    <hr className="border-white/10 my-12" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-300">
                      {children}
                    </em>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            
            {/* 返回按钮 */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <Link 
                href={`/category/${slug}`}
                className="inline-flex items-center space-x-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <span>←</span>
                <span>Back to {post.category}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 相关文章推荐 */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 mt-16">
            <h3 className="text-2xl font-bold mb-8 text-white">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/category/${slug}/${relatedPost.slug}`}
                  className="group block p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <h4 className="text-lg font-medium mb-2 text-white group-hover:text-white/90 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* 底部温馨提示 */}
        <footer className="max-w-4xl mx-auto px-6 mt-16 py-12 text-center border-t border-white/10">
          <p className="text-[10px] text-white/20">
            DeepSoul AI • Companion for {post.category}
          </p>
        </footer>
      </section>
      <div className="h-24" />
      
      {/* --- 侧边悬浮按钮 (Floating CTA) --- */}
      <Link 
        href={`/${slug}/onboarding`}
        className="fixed bottom-20 right-8 z-50 group"
      >
        <button 
          className="relative px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
        >
          <span className="text-sm tracking-[0.1em] uppercase text-white/90 group-hover:text-white flex items-center gap-2">
            Start Incubation <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </span>
        </button>
      </Link>
    </main>
  );
}