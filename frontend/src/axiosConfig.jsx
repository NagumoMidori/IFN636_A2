import axios from 'axios';

export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : 'http://localhost:5001';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
   headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const rawData = localStorage.getItem('userInfo');

    if (rawData) {
      try {
        const userInfo = JSON.parse(rawData);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
          console.log("Axios: Token successfully injected into Header");
        }
      } catch (err) {
        console.error("Axios: Failed to parse userInfo", err);
      }
    } else {
      console.warn("Axios: userInfo not found in localStorage, cannot inject Token");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
