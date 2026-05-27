import { useState, useEffect, useCallback } from 'react';

export default function ThemeToggle() {
  // 初始化为 null，在 useEffect 中再设置正确的值
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // 同步主题状态的函数
  const syncTheme = useCallback(() => {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    
    if (savedTheme) {
      const shouldBeDark = savedTheme === 'dark';
      setIsDark(shouldBeDark);
      // 确保文档类名与 localStorage 一致
      if (shouldBeDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    } else {
      // 检查当前文档的 dark 类名状态（由 BaseLayout 的内联脚本设置）
      const hasDarkClass = html.classList.contains('dark');
      if (hasDarkClass) {
        setIsDark(true);
      } else {
        // 尊重系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      }
    }
  }, []);

  useEffect(() => {
    // 组件挂载时同步主题
    syncTheme();

    // 监听页面切换事件（由 BaseLayout 中的脚本触发）
    const handlePageLoad = () => {
      syncTheme();
    };

    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, [syncTheme]);

  const toggleTheme = () => {
    if (isDark === null) return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // 更新 html 标签的类名
    const html = document.documentElement;
    if (newIsDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // 保存到 localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    
    // 派发主题变更事件，通知其他组件
    document.dispatchEvent(new Event('themechange'));
  };

  // 当 isDark 为 null 时，显示加载状态
  if (isDark === null) {
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 text-gray-500"
        disabled
        aria-label="加载中..."
      >
        <span className="text-xl">⏳</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
}
