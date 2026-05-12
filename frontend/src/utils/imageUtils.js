// src/utils/imageUtils.js
export const getImageUrl = (path) => {
  if (!path) return '/images/bondi_beach.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:5001${path}`; 
};