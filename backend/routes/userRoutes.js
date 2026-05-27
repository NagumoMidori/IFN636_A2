const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getUserById,
    getAllUsers
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// ── User's own profile (authenticated) ──────────
// GET    /api/users/profile   → Read own profile
// PUT    /api/users/profile   → Update own profile (name, email, phone, etc.)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// ── Admin routes ────────────────────────────────
// GET /api/users       → List all users (admin only)
// GET /api/users/:id   → Get a specific user by ID (admin only)
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);

module.exports = router