const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);

// Admin routes
router.post('/', protect, adminOnly, upload.single('imageFile'), tourController.createTour); 
router.put('/:id', protect, adminOnly, upload.single('imageFile'), tourController.updateTour);
router.delete('/:id', protect, adminOnly, tourController.deleteTour);

module.exports = router;