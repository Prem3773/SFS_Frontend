const fallbackApiBaseUrl =
  typeof window !== 'undefined' &&
  !['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? '/api'
    : 'http://localhost:3001/api';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || fallbackApiBaseUrl).replace(/\/$/, '');

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
