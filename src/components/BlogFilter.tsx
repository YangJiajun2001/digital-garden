import { useState, useMemo } from 'react';
import ContentCard from './ContentCard';

interface Post {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    status: 'seed' | 'growing' | 'evergreen';
    tags: string[];
  };
  collection?: string;
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

  return (
    <div>
      <div className="flex gap-3 mb-8 flex-wrap">
        {(Object.keys(statusConfig) as FilterType[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === key
                ? 'bg-purple-500/30 border-purple-500 text-gray-900 dark:text-white'
                : 'bg-transparent border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:border-purple-500/50'
            }`}
          >
            {statusConfig[key].emoji} {statusConfig[key].label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post, index) => {
          return (
            <ContentCard
              key={post.slug}
              post={post}
              className=""
            />
          );
        })}
      </div>
    </div>
  );
};

export default BlogFilter;
