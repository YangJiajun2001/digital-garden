import type { Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

interface Options {
  titleMap?: Record<string, string>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export const remarkWikiLinks: Plugin<[Options?], Root> = (options = {}) => {
  const titleMap = options.titleMap || {};

  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number, parent: any) => {
      if (!parent || typeof index !== 'number') return;
      if (!Array.isArray(parent.children)) return;

      const value = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;
      let match;
      let lastEnd = 0;
      const newNodes: any[] = [];

      while ((match = regex.exec(value)) !== null) {
        if (match.index > lastEnd) {
          newNodes.push({ type: 'text', value: value.slice(lastEnd, match.index) });
        }

        const title = match[1];
        const targetSlug = titleMap[title] || slugify(title);

        newNodes.push({
          type: 'link',
          url: `/blog/${targetSlug}`,
          children: [{ type: 'text', value: title }],
          data: {
            hProperties: {
              className: 'wikilink',
              'data-slug': targetSlug,
            },
          },
        });

        lastEnd = match.index + match[0].length;
      }

      if (newNodes.length > 0) {
        if (lastEnd < value.length) {
          newNodes.push({ type: 'text', value: value.slice(lastEnd) });
        }
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
};