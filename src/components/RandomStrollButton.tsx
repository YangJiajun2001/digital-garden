import { useState, useEffect } from 'react';
import { BASE_PATH, API_PATH, BLOG_PATH } from '../utils/base';

const STORAGE_KEY = 'random_stroll_visited_slugs';

export default function RandomStrollButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const visited = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setVisitedCount(visited.length);
    
    fetch(`${API_PATH}/slugs.json`)
      .then(res => res.json())
      .then(slugs => setTotalCount(slugs.length))
      .catch(() => setTotalCount(0));
  }, []);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_PATH}/slugs.json`);
      const allSlugs = await response.json();
      
      if (allSlugs.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const visitedSlugs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const availableSlugs = allSlugs.filter(slug => !visitedSlugs.includes(slug));
      
      if (availableSlugs.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        
        if ('startViewTransition' in document) {
          document.startViewTransition(() => {
            window.location.href = BASE_PATH;
          });
        } else {
          window.location.href = BASE_PATH;
        }
        return;
      }
      
      const randomSlug = availableSlugs[Math.floor(Math.random() * availableSlugs.length)];
      const newVisited = [...visitedSlugs, randomSlug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisited));
      setVisitedCount(newVisited.length);
      
      if ('startViewTransition' in document) {
        document.startViewTransition(() => {
          window.location.href = `${BLOG_PATH}/${randomSlug}`;
        });
      } else {
        window.location.href = `${BLOG_PATH}/${randomSlug}`;
      }
    } catch (error) {
      console.error('Failed to fetch slugs:', error);
      setIsLoading(false);
    }
  };

  const progress = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="random-stroll-btn px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 
                   border border-amber-500/50 hover:border-amber-400 rounded-lg transition-all duration-300 
                   text-amber-400 hover:text-amber-300 font-medium
                   hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5
                   disabled:opacity-50 disabled:cursor-not-allowed
                   animate-[shake_0.5s_ease-in-out_infinite]"
        style={{
          animationPlayState: 'paused',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>漫步中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>随机漫步</span>
              {totalCount > 0 && (
                <span className="text-xs text-amber-500/70">
                  ({visitedCount}/{totalCount})
                </span>
              )}
            </>
          )}
        </span>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
        `}</style>
      </button>
      
      {totalCount > 0 && progress > 0 && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}