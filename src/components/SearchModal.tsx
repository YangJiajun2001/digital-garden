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
        <mark key={`highlight-${currentIndex}`} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-0.5 rounded">
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setQuery('');
          setResults([]);
          setSelectedIndex(-1);
        }}
      />
      
      <div className="search-modal-container relative w-full max-w-xl mx-4 bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
            <svg 
              className="w-5 h-5 text-emerald-500 dark:text-emerald-400" 
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
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-lg font-medium"
          />
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-sm">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium">Esc</kbd>
          </div>
        </div>

        <div className="max-h-[45vh] overflow-y-auto px-5 pb-2">
          {isLoading && (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 dark:text-gray-500">搜索中...</p>
            </div>
          )}
          
          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">未找到相关结果</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">尝试其他关键词试试</p>
            </div>
          )}
          
          {!isLoading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, index) => (
                <button
                  key={`${result.url}-${index}`}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                    index === selectedIndex 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleResultClick(result.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      index === selectedIndex 
                        ? 'bg-emerald-500 dark:bg-emerald-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 transition-colors ${
                        index === selectedIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {highlightMatch(result.title, query)}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                        {result.excerpt}
                      </p>
                      <span className="inline-block mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {result.date}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!query && posts.length > 0 && (
            <div className="py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 px-4">最近文章</p>
              <div className="space-y-2">
                {posts.slice(0, 5).map((post, index) => (
                  <button
                    key={`recent-${post.slug}`}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      index === selectedIndex 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleResultClick(`${BLOG_PATH}/${post.slug}`)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        index === selectedIndex 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 ${
                          index === selectedIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {post.title}
                        </h3>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {post.pubDate}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {!query && posts.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">正在加载文章...</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">请稍候</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs font-medium">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs font-medium">Enter</kbd>
                选择
              </span>
            </div>
            <span>共 {results.length} 篇{query && results.length !== posts.length ? ` / ${posts.length}` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
