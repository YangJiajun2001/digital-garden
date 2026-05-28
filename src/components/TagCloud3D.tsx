import { useEffect, useRef, useState, useCallback } from 'react';
import { BASE_PATH } from '../utils/base';

interface Tag {
  name: string;
  count: number;
}

interface TagCloud3DProps {
  tags: Tag[];
}

const TagCloud3D = ({ tags }: TagCloud3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const rotationYRef = useRef(0);
  const targetRotationRef = useRef(0.003);
  const currentRotationRef = useRef(0.003);

  const [positions, setPositions] = useState<Array<{
    tag: Tag;
    x: number;
    y: number;
    z: number;
    scale: number;
    opacity: number;
    fontSize: number;
    color: string;
    screenX: number;
    screenY: number;
    displayScale: number;
    displayZ: number;
  }>>([]);

  const colors = [
    'text-emerald-400',
    'text-emerald-300',
    'text-teal-400',
    'text-teal-300',
    'text-cyan-400',
    'text-cyan-300',
  ];

  const projectTo2D = useCallback((
    x: number,
    y: number,
    z: number,
    rotY: number,
    containerWidth: number,
    containerHeight: number
  ) => {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const rotatedX = x * cosY - z * sinY;
    const rotatedZ = x * sinY + z * cosY;

    const scale = 1.5 / (1.5 + rotatedZ);
    const maxDimension = Math.min(containerWidth, containerHeight);
    const screenX = rotatedX * scale * (maxDimension * 0.35) + containerWidth / 2;
    const screenY = y * scale * (maxDimension * 0.35) + containerHeight / 2;

    return { screenX, screenY, scale, z: rotatedZ };
  }, []);

  const initAndUpdatePositions = useCallback((containerWidth: number, containerHeight: number) => {
    if (tags.length === 0) return [];

    const radius = 1;
    const phi = Math.PI * (3 - Math.sqrt(5));
    const maxCount = Math.max(...tags.map(t => t.count));
    const minCount = Math.min(...tags.map(t => t.count));
    const countRange = maxCount - minCount || 1;

    return tags.map((tag, i) => {
      const t = i / tags.length;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = phi * i;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(azimuth);

      const normalizedCount = (tag.count - minCount) / countRange;
      const fontSize = 1.2 + normalizedCount * 1.0;
      const scale = 0.9 + normalizedCount * 0.3;
      const opacity = 0.7 + normalizedCount * 0.3;

      const colorIndex = Math.floor(normalizedCount * (colors.length - 1));
      const color = colors[colorIndex];

      const projected = projectTo2D(x, y, z, rotationYRef.current, containerWidth, containerHeight);

      return {
        tag,
        x,
        y,
        z,
        scale,
        opacity,
        fontSize,
        color,
        screenX: projected.screenX,
        screenY: projected.screenY,
        displayScale: projected.scale,
        displayZ: projected.z,
      };
    });
  }, [tags, projectTo2D]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || tags.length === 0) return;

    const updatePositions = () => {
      const rect = container.getBoundingClientRect();
      const newPositions = initAndUpdatePositions(rect.width, rect.height);
      setPositions(newPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
    };
  }, [tags, initAndUpdatePositions]);

  const animate = useCallback(() => {
    if (!containerRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.05;
    rotationYRef.current += currentRotationRef.current;

    setPositions(prev => prev.map(pos => {
      const projected = projectTo2D(
        pos.x,
        pos.y,
        pos.z,
        rotationYRef.current,
        width,
        height
      );
      return {
        ...pos,
        screenX: projected.screenX,
        screenY: projected.screenY,
        displayScale: projected.scale,
        displayZ: projected.z,
      };
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [projectTo2D]);

  useEffect(() => {
    if (tags.length === 0) return;
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, tags.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    targetRotationRef.current = deltaX * 0.03;
  }, []);

  const handleTagClick = (tagName: string) => {
    window.location.href = `${BASE_PATH}/tags/${encodeURIComponent(tagName)}`;
  };

  if (tags.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        暂无标签
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] relative cursor-pointer select-none"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden">
        {positions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span>加载中...</span>
            </div>
          </div>
        ) : (
          positions.map((pos, i) => {
            const depthFactor = (pos.displayZ + 1) / 2;
            const finalScale = pos.displayScale * pos.scale * 1.5;
            const finalOpacity = Math.min(Math.max(pos.opacity * (0.6 + depthFactor * 0.6), 0.3), 1);

            return (
              <div
                key={`${pos.tag.name}-${i}`}
                className={`absolute transition-all duration-100 ${pos.color} hover:text-white dark:hover:text-emerald-300 cursor-pointer`}
                style={{
                  left: `${pos.screenX}px`,
                  top: `${pos.screenY}px`,
                  transform: `translate(-50%, -50%) scale(${finalScale})`,
                  opacity: finalOpacity,
                  fontSize: `${pos.fontSize}rem`,
                  fontWeight: pos.tag.count > 1 ? '600' : '500',
                  textShadow: depthFactor > 0.6
                    ? '0 0 12px rgba(52, 211, 153, 0.6), 0 0 24px rgba(52, 211, 153, 0.3)'
                    : depthFactor > 0.3
                    ? '0 0 6px rgba(52, 211, 153, 0.3)'
                    : 'none',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                  zIndex: Math.floor(depthFactor * 100),
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: depthFactor > 0.6 ? 'rgba(52, 211, 153, 0.08)' : 'transparent',
                }}
                onClick={() => handleTagClick(pos.tag.name)}
              >
                {pos.tag.name}
                <span className="ml-1 opacity-70 text-sm">
                  {pos.tag.count}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TagCloud3D;
