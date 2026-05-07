import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../axiosConfig'; // 確保路徑指向你的 axios 設定

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 抓取所有行程 (Read)
  const fetchTours = async () => {
    try {
      const res = await axios.get('/tours');
      setTours(res.data);
      setLoading(false);
    } catch (err) {
      console.error("抓取行程失敗", err);
    }
  };

  // 2. 新增行程 (Create)
  const addTour = async (tourData) => {
    try {
      const res = await axios.post('/tours', tourData);
      setTours([...tours, res.data]); // 更新本地列表，畫面會立刻跳出新行程
    } catch (err) {
      console.error("新增行程失敗", err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <TourContext.Provider value={{ tours, addTour, fetchTours, loading }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTours = () => useContext(TourContext);