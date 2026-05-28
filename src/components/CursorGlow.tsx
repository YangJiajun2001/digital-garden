import { useState, useEffect, useRef } from 'react';

export default function CursorGlow() {
  // 鼠标位置状态
  const [position, setPosition] = useState({ x: -500, y: -500 });
  // 是否为暗色模式
  const [isDark, setIsDark] = useState(false);
  // 用于平滑动画的引用
  const rafRef = useRef<number>();

  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // 初始检查
    checkTheme();

    // 监听类名变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // 监听鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 使用 requestAnimationFrame 实现平滑跟随
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 如果不是暗色模式，不渲染
  if (!isDark) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-full"
      style={{
        width: '350px',
        height: '350px',
        left: position.x - 175,
        top: position.y - 175,
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 70%)',
        mixBlendMode: 'screen',
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  );
}
