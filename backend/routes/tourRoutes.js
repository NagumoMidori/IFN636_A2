const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 公開路由
router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);

// 管理員路由
// 🔴 提醒：確保後端 tourController 有對應的 createTour, updateTour, deleteTour 函式
router.post('/', protect, adminOnly, upload.single('imageFile'), tourController.createTour); 
router.put('/:id', protect, adminOnly, upload.single('imageFile'), tourController.updateTour);
router.delete('/:id', protect, adminOnly, tourController.deleteTour);

module.exports = router;