import { useState, useEffect, useCallback } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight <= 0) {
      setProgress(0);
      return;
    }
    
    const percentage = Math.min((scrollTop / docHeight) * 100, 100);
    setProgress(percentage);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [calculateProgress]);

  const glowIntensity = progress / 100;

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[3px] pointer-events-none"
      style={{
        background: 'linear-gradient(to right, #10b981, #22d3ee)',
        width: `${progress}%`,
        boxShadow: progress > 0 
          ? `0 0 ${8 + glowIntensity * 12}px rgba(16, 185, 129, ${0.3 + glowIntensity * 0.5})`
          : 'none',
        transition: 'width 0.1s ease-out',
      }}
    />
  );
}
