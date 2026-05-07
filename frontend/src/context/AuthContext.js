import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔴 修正 1：初始化時，從 localStorage 抓回使用者，否則一重新整理就登出了
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    // 🔴 修正 2：登入時，必須把資料存進 localStorage，攔截器才抓得到 Token
    localStorage.setItem('userInfo', JSON.stringify(userData));
    console.log("💾 AuthContext: userInfo 已存入 localStorage");
  };

  const logout = () => {
    setUser(null);
    // 🔴 修正 3：登出時清除資料
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
