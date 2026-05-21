import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const nodes = posts.map((post) => ({
    id: post.slug,
    name: post.data.title,
    status: post.data.status,
    tags: post.data.tags || [],
  }));

  const links: { source: string; target: string; type?: string }[] = [];
  const tagMap = new Map<string, string[]>();

  posts.forEach((post) => {
    const content = post.body;
    const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
    let match;

    while ((match = wikiLinkPattern.exec(content)) !== null) {
      const linkedTitle = match[1];
      const targetPost = posts.find((p) => p.data.title === linkedTitle);
      if (targetPost && targetPost.slug !== post.slug) {
        const existingLink = links.find(
          (l) => l.source === post.slug && l.target === targetPost.slug
        );
        if (!existingLink) {
          links.push({
            source: post.slug,
            target: targetPost.slug,
          });
        }
      }
    }

    if (post.data.tags) {
      post.data.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(post.slug);
      });
    }
  });

  tagMap.forEach((slugs) => {
    if (slugs.length > 1) {
      for (let i = 0; i < slugs.length - 1; i++) {
        for (let j = i + 1; j < slugs.length; j++) {
          const existingLink = links.find(
            (l) =>
              (l.source === slugs[i] && l.target === slugs[j]) ||
              (l.source === slugs[j] && l.target === slugs[i])
          );
          if (!existingLink) {
            links.push({
              source: slugs[i],
              target: slugs[j],
              type: 'tag',
            });
          }
        }
      }
    }
  });

  return new Response(JSON.stringify({ nodes, links }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};