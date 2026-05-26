import { useState, useRef, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl cursor-pointer overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: transform ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80 shadow-sm dark:from-gray-900/95 dark:to-gray-800/70 dark:border-gray-700/50 dark:shadow-lg" />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(52, 211, 153, 0.08) 0%, transparent 50%)`,
          transition: 'background 0.1s ease-out',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-70"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(0, 0, 0, 0.04) 0%, transparent 35%)`,
          transition: 'background 0.15s ease-out',
        }}
      />
      <div className="relative z-10 h-full p-6">
        {children}
      </div>
    </div>
  );
}
