import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCollection } from 'astro:content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateGraphData() {
  const posts = await getCollection('blog');

  const nodes = posts.map((post) => ({
    id: post.slug,
    name: post.data.title,
    status: post.data.status,
    tags: post.data.tags || [],
  }));

  const links = [];
  const tagMap = new Map();

  posts.forEach((post) => {
    const content = post.body;
    const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
    let match;

    while ((match = wikiLinkPattern.exec(content)) !== null) {
      const linkedTitle = match[1];
      const targetPost = posts.find((p) => p.data.title === linkedTitle);
      if (targetPost && targetPost.slug !== post.slug) {
        links.push({
          source: post.slug,
          target: targetPost.slug,
        });
      }
    }

    if (post.data.tags) {
      post.data.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag).push(post.slug);
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

  const graphData = { nodes, links };

  const outputPath = path.join(__dirname, '../../public/graph-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(graphData, null, 2));

  console.log('Graph data generated:', outputPath);
}

generateGraphData();