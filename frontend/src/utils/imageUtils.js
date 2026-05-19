import { API_BASE_URL } from '../axiosConfig';

export const getImageUrl = (path) => {
  if (!path) return '/images/bondi_beach.jpg';
  if (path.startsWith('http') || path.startsWith('/images')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return path;
};
