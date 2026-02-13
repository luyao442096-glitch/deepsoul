import { MetadataRoute } from 'next';
import { getCategoryPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.deepsoullab.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  const categories = ['burnout', 'cant-sleep', 'invisible', 'spiraling', 'stuck-in-overwhelm'];
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  const articlePages: MetadataRoute.Sitemap = [];
  
  for (const category of categories) {
    try {
      const posts = await getCategoryPosts(category);
      for (const post of posts) {
        articlePages.push({
          url: `${baseUrl}/category/${category}/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error(`Error fetching posts for ${category}:`, error);
    }
  }
  
  return [...staticPages, ...categoryPages, ...articlePages];
}