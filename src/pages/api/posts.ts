import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  
  const postsData = posts.map((post) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    status: post.data.status,
    tags: post.data.tags || [],
    pubDate: new Date(post.data.pubDate).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));

  return new Response(JSON.stringify(postsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}