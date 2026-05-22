export const BASE_PATH = '/digital-garden';

export const getPath = (path: string): string => {
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  return `${BASE_PATH}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const BLOG_PATH = `${BASE_PATH}/blog`;
export const NOTES_PATH = `${BASE_PATH}/notes`;
export const GARDEN_PATH = `${BASE_PATH}/garden`;
export const NOW_PATH = `${BASE_PATH}/now`;
export const API_PATH = `${BASE_PATH}/api`;
