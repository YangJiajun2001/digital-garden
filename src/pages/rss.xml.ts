import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  
  // 按发布日期降序排列
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const siteUrl = 'https://yangjiajun2001.github.io/digital-garden/';

  const rssContent = await rss({
    title: 'My Digital Garden',
    description: '思维花园 - 播种想法，培育认知',
    site: siteUrl,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${siteUrl}blog/${post.slug}/`,
    })),
  });

  return new Response(rssContent.body, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
};
