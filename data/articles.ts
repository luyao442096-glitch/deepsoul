// 文章数据
export interface Article {
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  content: string;
}

export const articles: Record<string, Article> = {}