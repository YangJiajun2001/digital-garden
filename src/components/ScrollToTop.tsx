import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 监听页面滚动
  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过 300px 时显示按钮
      setIsVisible(window.scrollY > 300);
    };

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll);

    // 清理监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12 rounded-full
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur-md
        border border-gray-200 dark:border-gray-700
        flex items-center justify-center
        text-gray-600 dark:text-gray-300
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:shadow-emerald-500/20
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
