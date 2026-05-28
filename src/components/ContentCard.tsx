import { BLOG_PATH, NOTES_PATH } from '../utils/base';

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

interface ContentCardProps {
  post: Post;
  className?: string;
}

const statusConfig = {
  seed: { emoji: '🌱', label: '萌芽' },
  growing: { emoji: '🌿', label: '生长中' },
  evergreen: { emoji: '🌳', label: '常青' },
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ContentCard = ({ post, className = '' }: ContentCardProps) => {
  const isNote = post.collection === 'notes';
  const statusEmoji = statusConfig[post.data.status]?.emoji || '🌱';
  
  if (isNote) {
    return (
      <article className={`bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 ${className}`}>
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="flex-1">
            {post.data.title && (
              <h2 className="text-lg font-semibold mb-2 transition-all duration-300 bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-200 bg-clip-text text-transparent">
                {post.data.title}
              </h2>
            )}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.data.content || post.data.description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {formatDate(post.data.pubDate)}
              </span>
              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 ${className}`}>
      <a
        href={`${BLOG_PATH}/${post.slug}`}
        className="block h-full group"
      >
        <span className="text-xs text-gray-500 float-right">
          {formatDate(post.data.pubDate)}
        </span>
        <span className="text-xl">{statusEmoji}</span>
        <h2 className="text-xl md:text-2xl font-bold mt-2 mb-3 group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all duration-300 title-gradient">
          {post.data.title || (post.data.content?.substring(0, 50) + '...') || '无标题'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {post.data.description || post.data.content || ''}
        </p>
        {post.data.tags && post.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.data.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </a>
    </article>
  );
};

export default ContentCard;
