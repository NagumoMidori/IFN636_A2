const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // ✅ 這裡宣告一次就好
const connectDB = require('./config/db');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

// ✅ 必須先初始化 app，才能使用 app.use
const app = express();

// 連接資料庫
connectDB();

// 中間件設定
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由設定
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes); 

// 伺服器啟動邏輯
const PORT = process.env.PORT || 5001;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📂 Static files served from: ${path.join(__dirname, 'uploads')}`);
    });
}

module.exports = app;