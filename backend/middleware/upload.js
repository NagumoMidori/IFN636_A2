const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ 確保指向 backend 根目錄下的 uploads 資料夾
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // 使用時間戳記避免同名檔案覆蓋
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;