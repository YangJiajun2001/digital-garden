import { useState, useEffect, useCallback, useRef, type ReactElement } from 'react';
import { API_PATH, BLOG_PATH } from '../utils/base';

interface SearchResult {
  url: string;
  title: string;
  excerpt: ReactElement[];
  date: string;
}

interface PostData {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const highlightMatch = (text: string, query: string): ReactElement[] => {
    if (!query.trim() || !text) return [<span key="0">{text || ''}</span>];
    
    const result: ReactElement[] = [];
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    let lastIndex = 0;
    
    while (lastIndex <= text.length) {
      const currentIndex = textLower.indexOf(queryLower, lastIndex);
      
      if (currentIndex === -1) {
        if (lastIndex < text.length) {
          result.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
        }
        break;
      }
      
      if (currentIndex > lastIndex) {
        result.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, currentIndex)}</span>);
      }
      
      const matchText = text.substring(currentIndex, currentIndex + query.length);
      result.push(
        <mark key={`highlight-${currentIndex}`} className="bg-yellow-500/40 text-yellow-100 px-0.5 rounded">
          {matchText}
        </mark>
      );
      
      lastIndex = currentIndex + query.length;
    }
    
    return result;
  };

  const search = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    
    try {
      if (!searchQuery.trim()) {
        const allPosts: SearchResult[] = posts
          .map(post => ({
            url: `${BLOG_PATH}/${post.slug}`,
            title: post.title,
            excerpt: highlightMatch(post.description, ''),
            date: post.pubDate
          }));
        
        setResults(allPosts);
        setSelectedIndex(0);
        setIsLoading(false);
        return;
      }

      const searchTerm = searchQuery.toLowerCase();
      
      const matchedPosts: SearchResult[] = posts
        .filter(post => {
          const titleMatch = post.title.toLowerCase().includes(searchTerm);
          const descMatch = post.description.toLowerCase().includes(searchTerm);
          return titleMatch || descMatch;
        })
        .map(post => ({
          url: `${BLOG_PATH}/${post.slug}`,
          title: post.title,
          excerpt: highlightMatch(post.description, searchQuery),
          date: post.pubDate
        }));
      
      setResults(matchedPosts);
      setSelectedIndex(0);
    } catch (error) {
      console.error('搜索失败:', error);
      setResults([]);
      setSelectedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`${API_PATH}/posts`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('加载文章列表失败:', error);
      }
    };
    
    if (isOpen && posts.length === 0) {
      loadPosts();
    }
  }, [isOpen, posts.length]);

  useEffect(() => {
    if (isOpen && posts.length > 0 && query === '') {
      search('');
    }
  }, [isOpen, posts.length, query, search]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      search(query);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          if (prev < results.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }

      if (e.key === 'Enter' && selectedIndex >= 0 && results.length > 0) {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          setIsOpen(false);
          setQuery('');
          setResults([]);
          setSelectedIndex(-1);
          window.location.href = selectedResult.url;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.search-modal-container')) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleSearchClick = () => {
      setIsOpen(true);
    };

    const searchBtn = document.querySelector('.search-trigger');
    searchBtn?.addEventListener('click', handleSearchClick);
    return () => searchBtn?.removeEventListener('click', handleSearchClick);
  }, []);

  const handleResultClick = (url: string) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    window.location.href = url;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setQuery('');
          setResults([]);
          setSelectedIndex(-1);
        }}
      />
      
      <div className="search-modal-container absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="flex items-center px-4 py-4 border-b border-gray-700/50">
          <svg 
            className="w-5 h-5 text-gray-400 mr-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
          />
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>
            <span>关闭</span>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-8 text-center text-gray-400">
              搜索中...
            </div>
          )}
          
          {!isLoading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400">
              未找到相关结果
            </div>
          )}
          
          {!isLoading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result, index) => (
                <li 
                  key={`${result.url}-${index}`}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-gray-800/80' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleResultClick(result.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <svg 
                      className={`w-4 h-4 mt-1 flex-shrink-0 ${
                        index === selectedIndex 
                          ? 'text-emerald-400' 
                          : 'text-gray-500'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium mb-1 ${
                        index === selectedIndex ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {highlightMatch(result.title, query)}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">
                        {result.excerpt}
                      </p>
                      <span className="text-xs text-gray-500">
                        {result.date}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {!query && (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="mb-2">输入关键词开始搜索</p>
              <p className="text-sm">支持 Cmd/Ctrl + K 快捷键唤起</p>
              {posts.length === 0 && (
                <p className="text-xs mt-2 text-yellow-500/70">正在加载文章索引...</p>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-800/30">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Enter</kbd>
                选择
              </span>
            </div>
            <span>共 {results.length} 篇文章{query && results.length !== posts.length ? ` (筛选自 ${posts.length} 篇)` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
