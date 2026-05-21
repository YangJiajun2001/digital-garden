import { useEffect, useState, useRef } from 'react';

const SpotlightEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>(0);
  const targetPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      setPosition((prev) => {
        const ease = 0.08;
        const newX = prev.x + (targetPositionRef.current.x - prev.x) * ease;
        const newY = prev.y + (targetPositionRef.current.y - prev.y) * ease;
        return { x: newX, y: newY };
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  return (
    <div
      className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: `radial-gradient(
          circle at center,
          rgba(52, 211, 153, 0.08) 0%,
          rgba(52, 211, 153, 0.04) 20%,
          rgba(52, 211, 153, 0.02) 40%,
          transparent 70%
        )`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default SpotlightEffect;