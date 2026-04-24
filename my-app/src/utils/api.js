const productionApiBaseUrl = 'https://feedback-system-1-0sp1.onrender.com/api';

const fallbackApiBaseUrl =
  typeof window !== 'undefined' &&
  !['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? productionApiBaseUrl
    : 'http://localhost:3001/api';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || fallbackApiBaseUrl).replace(/\/$/, '');

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`API returned a non-JSON response (${response.status} ${response.statusText})`);
  }
};
