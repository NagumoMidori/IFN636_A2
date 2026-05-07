const Tour = require('../models/Tour');

// @desc    獲取所有行程
// @route   GET /api/tours
exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find({}).sort({ createdAt: -1 });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: "獲取行程失敗: " + err.message });
    }
};

// @desc    獲取單一行程詳情
// @route   GET /api/tours/:id
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: '找不到該行程' });
        }
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: "無效的行程 ID" });
    }
};

// @desc    新增行程 (Admin Only)
// @route   POST /api/tours
exports.createTour = async (req, res) => {
    try {
        console.log("📥 [Create] Received Body:", req.body);
        console.log("🖼️ [Create] Received File:", req.file);

        const tourData = {
            ...req.body,
            // 如果 Multer 有抓到檔案，儲存路徑；否則留空或用預設圖
            imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || ''
        };

        const tour = new Tour(tourData);
        const createdTour = await tour.save();
        
        console.log("✅ [Create] Success:", createdTour._id);
        res.status(201).json(createdTour);
    } catch (err) {
        console.error("❌ [Create] Error:", err.message);
        res.status(400).json({ message: "新增失敗: " + err.message });
    }
};

// @desc    更新行程 (Admin Only)
// @route   PUT /api/tours/:id
exports.updateTour = async (req, res) => {
    try {
        console.log(`Update] ID: ${req.params.id}`);
        
        const updateData = { ...req.body };

        // 如果更新時有上傳新照片，覆蓋 imageUrl
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            console.log("🖼️ [Update] New image uploaded:", updateData.imageUrl);
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedTour) {
            return res.status(404).json({ message: '找不到行程，更新失敗' });
        }

        console.log("✅ [Update] Success");
        res.json(updatedTour);
    } catch (err) {
        console.error("❌ [Update] Error:", err.message);
        res.status(400).json({ message: "更新失敗: " + err.message });
    }
};

// @desc    刪除行程 (Admin Only)
// @route   DELETE /api/tours/:id
exports.deleteTour = async (req, res) => {
    try {
        console.log(`🗑️ [Delete] Attempting to delete ID: ${req.params.id}`);
        
        const tour = await Tour.findById(req.params.id);

        if (!tour) {
            console.log("⚠️ [Delete] Tour not found");
            return res.status(404).json({ message: '找不到該行程，無法刪除' });
        }

        // 使用 deleteOne 或 findByIdAndDelete
        await Tour.findByIdAndDelete(req.params.id);

        console.log("✅ [Delete] Successful");
        res.json({ message: '行程已成功刪除' });
    } catch (err) {
        console.error("❌ [Delete] Error:", err.message);
        res.status(500).json({ message: "伺服器錯誤，刪除失敗" });
    }
};