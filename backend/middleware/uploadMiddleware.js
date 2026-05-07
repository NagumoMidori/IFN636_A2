const multer = require('multer');
const path = require('path');

// 設定儲存引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 確保你的 backend 目錄下有一個 uploads 資料夾
    },
    filename: function (req, file, cb) {
        // 重新命名檔案：時間戳 + 原副檔名
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 檢查檔案類型
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;