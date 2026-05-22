import { useState, useMemo } from 'react';
import TiltCard from './TiltCard';
import { BLOG_PATH } from '../utils/base';

export interface Note {
  slug: string;
  type: 'note';
  data: {
    title?: string;
    content: string;
    pubDate: Date;
    tags: string[];
  };
}

export interface BlogPost {
  slug: string;
  type: 'blog';
  data: {
    title: string;
    description: string;
    pubDate: Date;
    status: 'seed' | 'growing' | 'evergreen';
    tags: string[];
  };
}

export type ContentItem = Note | BlogPost;

interface Props {
  items: ContentItem[];
}

const statusConfig = {
  all: { label: '全部', emoji: '' },
  seed: { label: '🌱 种子', emoji: '' },
  growing: { label: '🌿 生长中', emoji: '' },
  evergreen: { label: '🌳 常青', emoji: '' },
};

const FilterGrid = ({ items }: Props) => {
  const [activeTag, setActiveTag] = useState<string>('all');

  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    
    items.forEach((item) => {
      item.data.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCount).map(([tag, count]) => ({
      tag,
      count,
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );

    if (activeTag === 'all') return sorted;
    
    if (['seed', 'growing', 'evergreen'].includes(activeTag)) {
      return sorted.filter((item) => {
        if (item.type === 'blog') {
          return item.data.status === activeTag;
        }
        return false;
      });
    }

    return sorted.filter((item) => item.data.tags.includes(activeTag));
  }, [items, activeTag]);

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      seed: '🌱',
      growing: '🌿',
      evergreen: '🌳',
    };
    return emojis[status] || '🌱';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isStatusTag = (tag: string) => ['all', 'seed', 'growing', 'evergreen'].includes(tag);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTag(key)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
              activeTag === key
                ? 'bg-purple-500/30 border-purple-500 text-white scale-105'
                : 'bg-transparent border-white/20 text-gray-400 hover:bg-purple-500/20 hover:border-purple-500/50 hover:scale-105'
            }`}
          >
            {statusConfig[key].label}
          </button>
        ))}
        
        <div className="w-full h-px bg-gray-800 my-2" />
        
        {allTags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
              activeTag === tag
                ? 'bg-emerald-500/30 border-emerald-500 text-white scale-105'
                : 'bg-transparent border-white/20 text-gray-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:scale-105'
            }`}
          >
            #{tag} ({count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const isFirst = index === 0;
          const isNote = item.type === 'note';

          return (
            <div
              key={`${item.type}-${item.slug}`}
              className={`transition-all duration-500 ease-out ${
                isFirst && !isNote ? 'lg:col-span-2' : ''
              }`}
            >
              {isNote ? (
                <TiltCard>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div className="flex-1">
                      {item.data.title && (
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.data.title}
                        </h3>
                      )}
                      <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                        {item.data.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(item.data.pubDate)}
                        </span>
                        {item.data.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.data.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ) : (
                <TiltCard className={isFirst ? 'lg:col-span-2' : ''}>
                  <a
                    href={`${BLOG_PATH}/${item.slug}`}
                    className="block h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xl">{getStatusEmoji(item.data.status)}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.data.pubDate)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {item.data.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {item.data.description}
                    </p>
                    {item.data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.data.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </TiltCard>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">暂无相关内容</p>
        </div>
      )}
    </div>
  );
};

export default FilterGrid;