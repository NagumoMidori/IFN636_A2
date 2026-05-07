const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. 註冊使用者 (Register)
const registerUser = async (req, res) => {
    // 🔴 對齊 Figma 欄位：使用 username, email, password, phone
    const { username, email, password, phone } = req.body;
    
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: '此 Email 已被註冊' });

        // 建立使用者
        // 注意：密碼加密通常在 User Model 的 pre-save hook 處理
        const user = await User.create({ 
            username, 
            email, 
            password, 
            phone,
            role: 'user' // 預設註冊身份為一般用戶
        });

        res.status(201).json({ 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            role: user.role, // 🔴 回傳 role 讓前端 AuthContext 存儲
            token: generateToken(user._id) 
        });
    } catch (error) {
        res.status(500).json({ message: "註冊失敗: " + error.message });
    }
};

// 2. 登入使用者 (Login)
// 在 backend/controllers/authController.js 裡的 loginUser
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        
        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: '信箱或密碼錯誤' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. 取得個人資料 (Get Profile)
const getProfile = async (req, res) => {
    try {
      // 從 authMiddleware 的 protect 中取得 req.user.id
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: '找不到使用者' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};

// 4. 更新個人資料 (Update Profile)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: '找不到使用者' });

        // 更新欄位 (對齊 Figma 內容)
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.university = req.body.university || user.university;
        user.address = req.body.address || user.address;

        // 如果使用者有輸入新密碼
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({ 
            id: updatedUser._id, 
            username: updatedUser.username, 
            email: updatedUser.email, 
            role: updatedUser.role,
            token: generateToken(updatedUser._id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };