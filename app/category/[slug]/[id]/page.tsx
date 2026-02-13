import { use } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPostData } from '../../../../lib/posts';
import type { Metadata } from 'next';
import ArticlePageUI from './ArticlePageUI';

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

// 服务器端组件
export default function ArticlePage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params);
  const post = use(getPostData(slug, id));
  
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
    <ArticlePageUI 
      slug={slug}
      id={id}
      post={post}
    />
  );
}