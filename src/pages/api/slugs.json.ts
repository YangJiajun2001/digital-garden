import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const slugs = posts.map((post) => post.slug);

  return new Response(JSON.stringify(slugs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}