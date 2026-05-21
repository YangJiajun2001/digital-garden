import { useEffect, useState } from 'react';

interface PostPreview {
  slug: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
}

interface PreviewData {
  x: number;
  y: number;
  post: PostPreview;
}

const HoverPreview = () => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [posts, setPosts] = useState<Record<string, PostPreview>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data: PostPreview[]) => {
        const postsMap: Record<string, PostPreview> = {};
        data.forEach((post) => {
          postsMap[post.slug] = post;
        });
        setPosts(postsMap);
        setIsLoaded(true);
      })
      .catch(() => {
        console.error('Failed to load posts data');
      });
  }, []);

  useEffect(() => {
    let hideTimeout: number | undefined;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('wikilink') && isLoaded) {
        clearTimeout(hideTimeout);
        const slug = target.getAttribute('data-slug');
        if (slug && posts[slug]) {
          setPreview({
            x: e.clientX,
            y: e.clientY,
            post: posts[slug],
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (relatedTarget?.closest('.hover-preview-card')) return;
      if (relatedTarget?.classList.contains('wikilink')) return;

      hideTimeout = window.setTimeout(() => {
        setPreview(null);
      }, 100);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(hideTimeout);
    };
  }, [posts, isLoaded]);

  if (!preview) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 animate-fadeIn hover-preview-card"
      style={{
        left: `${preview.x + 5}px`,
        top: `${preview.y + 5}px`,
        transform: 'none !important',
      }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-72 shadow-xl">
        <h3 className="text-white font-bold text-lg mb-2">{preview.post.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{preview.post.description}</p>
        <div className="flex gap-2 mt-3">
          {preview.post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoverPreview;