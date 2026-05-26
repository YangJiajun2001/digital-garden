import { useState, useEffect, useRef } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface FloatingTocProps {
  headings: Heading[];
}

export default function FloatingToc({ headings }: FloatingTocProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkWidth = () => {
      setIsVisible(window.innerWidth >= 1024);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (!isVisible || headings.length === 0) return;

    const headingElements = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isVisible, headings]);

  const handleClick = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible || headings.length === 0) {
    return null;
  }

  return (
    <nav
      className="fixed right-[calc((100vw-1280px)/2)] top-32 w-[200px] hidden lg:block max-h-[calc(100vh-160px)] overflow-y-auto"
      aria-label="Table of contents"
    >
      <div className="bg-gray-100/90 dark:bg-black/40 backdrop-blur-md border border-gray-300 dark:border-white/5 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">目录</h2>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.slug}>
              <button
                onClick={() => handleClick(heading.slug)}
                className={`
                  w-full text-left text-sm py-1 px-2 rounded transition-all duration-200
                  ${heading.depth === 3 ? 'pl-5' : ''}
                  ${activeId === heading.slug
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                <span
                  className={`
                    inline-block w-0.5 h-4 mr-2 align-middle transition-colors duration-200
                    ${activeId === heading.slug ? 'bg-emerald-500' : 'bg-transparent'}
                  `}
                />
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
