const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  university: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// 🔴 關鍵修正：確保加密邏輯正確執行
userSchema.pre('save', async function (next) {
  // 1. 如果密碼沒有被修改（例如只改了 address），就跳過加密
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // 2. 生成 Salt (鹽)
    const salt = await bcrypt.genSalt(10);
    // 3. 將明碼密碼替換為哈希加密碼
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🟢 比對密碼的方法 (供 Login 使用)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);