const productionApiBaseUrl = 'https://feedback-system-1-0sp1.onrender.com/api';

const isProductionHost =
  typeof window !== 'undefined' &&
  !['localhost', '127.0.0.1'].includes(window.location.hostname);

const fallbackApiBaseUrl =
  isProductionHost
    ? productionApiBaseUrl
    : 'http://localhost:3001/api';

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  isProductionHost && (!configuredApiBaseUrl || configuredApiBaseUrl.startsWith('/'))
    ? productionApiBaseUrl
    : configuredApiBaseUrl || fallbackApiBaseUrl
).replace(/\/$/, '');

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
