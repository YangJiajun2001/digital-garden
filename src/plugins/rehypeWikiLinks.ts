import type { Plugin } from 'unified';
import type { Root, Element, Text } from 'hast';
import { visit } from 'unist-util-visit';

interface Options {
  titleMap?: Record<string, string>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export const rehypeWikiLinks: Plugin<[Options?], Root> = (options = {}) => {
  const titleMap = options.titleMap || {};

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.children || !Array.isArray(node.children)) return;

      const newChildren: any[] = [];
      for (const child of node.children) {
        if (child.type === 'text' && typeof child.value === 'string') {
          const regex = /\[\[([^\]]+)\]\]/g;
          const matches = [...child.value.matchAll(regex)];
          
          if (matches.length === 0) {
            newChildren.push(child);
            continue;
          }

          let lastEnd = 0;
          for (const match of matches) {
            if (match.index && match.index > lastEnd) {
              newChildren.push({ type: 'text' as const, value: child.value.slice(lastEnd, match.index) });
            }

            const title = match[1];
            const targetSlug = titleMap[title] || slugify(title);

            newChildren.push({
              type: 'element' as const,
              tagName: 'a',
              properties: {
                href: `/blog/${targetSlug}`,
                className: 'wikilink',
                'data-slug': targetSlug,
              },
              children: [{ type: 'text' as const, value: title }],
            });

            lastEnd = (match.index || 0) + match[0].length;
          }

          if (lastEnd < child.value.length) {
            newChildren.push({ type: 'text' as const, value: child.value.slice(lastEnd) });
          }
        } else {
          newChildren.push(child);
        }
      }

      node.children = newChildren;
    });
  };
};