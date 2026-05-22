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
//dfj
axiosInstance.interceptors.request.use(
  (config) => {
    const rawData = localStorage.getItem('userInfo');
    
    if (rawData) {
      try {
        const userInfo = JSON.parse(rawData);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
          // 這行如果印出來，代表成功了
          console.log("🚀 Axios: Token 已成功注入 Header");
        }
      } catch (err) {
        console.error("Axios: 解析 userInfo 失敗", err);
      }
    } else {
      console.warn("🛰️ Axios: localStorage 找不到 userInfo，無法注入 Token");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
