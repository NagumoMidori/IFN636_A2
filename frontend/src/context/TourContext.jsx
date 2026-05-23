import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../axiosConfig';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all tours (Read)
  const fetchTours = async () => {
    try {
      const res = await axios.get('/tours');
      setTours(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tours", err);
    }
  };

  // 2. Add tour (Create)
  const addTour = async (tourData) => {
    try {
      const res = await axios.post('/tours', tourData);
      setTours([...tours, res.data]);
    } catch (err) {
      console.error("Failed to add tour", err);
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