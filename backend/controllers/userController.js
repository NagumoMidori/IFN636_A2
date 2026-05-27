const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ──────────────────────────────────────────────
// 1. READ - Get User Profile
// GET /api/users/profile
// ──────────────────────────────────────────────
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone || '',
            university: user.university || '',
            address: user.address || '',
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ──────────────────────────────────────────────
// 2. UPDATE - Update User Profile
// PUT /api/users/profile
// Allows updating: username, email, phone, university, address, password
// ──────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, phone, university, address, password } = req.body;

        // If email is being changed, check it's not already taken by another user
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use by another account' });
            }
            user.email = email;
        }

        // Update fields if provided (allow empty strings to clear optional fields)
        if (username !== undefined) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (university !== undefined) user.university = university;
        if (address !== undefined) user.address = address;

        // If user wants to change password
        if (password) {
            user.password = password; // Will be hashed by pre-save hook in User model
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            university: updatedUser.university || '',
            address: updatedUser.address || '',
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Update failed: ' + error.message });
    }
};

// ──────────────────────────────────────────────
// 3. READ - Get User by ID (Admin only)
// GET /api/users/:id
// ──────────────────────────────────────────────
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone || '',
            university: user.university || '',
            address: user.address || '',
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ──────────────────────────────────────────────
// 5. READ - Get All Users (Admin only)
// GET /api/users
// ──────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserById,
    getAllUsers
};
