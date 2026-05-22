import { useState, useMemo } from 'react';
import TiltCard from './TiltCard';
import { BLOG_PATH } from '../utils/base';

interface Post {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    status: 'seed' | 'growing' | 'evergreen';
    tags: string[];
  };
}

interface Props {
  posts: Post[];
}

const statusConfig = {
  all: { label: '全部', emoji: '' },
  seed: { label: '萌芽', emoji: '🌱' },
  growing: { label: '生长中', emoji: '🌿' },
  evergreen: { label: '常青', emoji: '🌳' },
};

type FilterType = 'all' | 'seed' | 'growing' | 'evergreen';

const BlogFilter = ({ posts }: Props) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );
    if (filter === 'all') return sorted;
    return sorted.filter((post) => post.data.status === filter);
  }, [posts, filter]);

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

  return (
    <div>
      <div className="flex gap-3 mb-8 flex-wrap">
        {(Object.keys(statusConfig) as FilterType[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === key
                ? 'bg-purple-500/30 border-purple-500 text-white'
                : 'bg-transparent border-white/20 text-gray-400 hover:bg-purple-500/20 hover:border-purple-500/50'
            }`}
          >
            {statusConfig[key].emoji} {statusConfig[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => {
          const isFirst = index === 0;
          const isTall = index === 2;

          return (
            <TiltCard
              key={post.slug}
              className={`${isFirst ? 'lg:col-span-2' : ''} ${isTall ? 'md:row-span-2' : ''}`}
            >
              <a
                href={`${BLOG_PATH}/${post.slug}`}
                className="block h-full group"
              >
                <span className="text-xs text-gray-500 float-right">
                  {formatDate(post.data.pubDate)}
                </span>
                <span className="text-xl">{getStatusEmoji(post.data.status)}</span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-2 mb-3 group-hover:text-emerald-400 transition-colors">
                  {post.data.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {post.data.description}
                </p>
                {post.data.tags && post.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.data.tags.map((tag) => (
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
          );
        })}
      </div>
    </div>
  );
};

export default BlogFilter;
