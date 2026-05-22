const Tour = require('../models/Tour');
const TourFactory = require('../factories/tourFactory'); // import factory

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get tours (with optional search)
// @route   GET /api/tours?search=keyword
exports.getTours = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {};

        if (search && search.trim()) {
            const regex = new RegExp(escapeRegExp(search.trim()), 'i');
            filter.$or = [
                { title: regex },
                { location: regex },
                { description: regex },
            ];
        }

        const tours = await Tour.find(filter).sort({ createdAt: -1 });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch tours: " + err.message });
    }
};

// @desc    get specific tour details
// @route   GET /api/tours/:id
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Cannot find tours.' });
        }
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: "Invalid tour ID" });
    }
};

// @desc    add tours (Admin Only)
// @route   POST /api/tours
exports.createTour = async (req, res) => {
    try {
        console.log("[Create] Received Body:", req.body);
        console.log("[Create] Received File:", req.file);

        const { type, ...restBody } = req.body;

        const tourData = {
            ...restBody,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || '../../../public/images/bondi_beach.webp'
        };

        // Use factory to create instances
        const tour = TourFactory.createTour(type, tourData);
        
        const createdTour = await tour.save();
        
        console.log("[Create] Success:", createdTour._id);
        res.status(201).json(createdTour);
    } catch (err) {
        console.error("[Create] Error:", err.message);
        res.status(400).json({ message: "Create failed: " + err.message });
    }
};

// @desc    update tours (Admin Only)
// @route   PUT /api/tours/:id
exports.updateTour = async (req, res) => {
    try {
        console.log(`🔄 [Update via Factory + Schema Hook] ID: ${req.params.id}`);
        
        const { type, ...restBody } = req.body;
        const updateData = { ...restBody };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        // 1. Have the factory inject any missing important notes and correct the type.
        const processedUpdateData = TourFactory.applyBusinessLogic(type, updateData);

        // 2. Write in database
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            { $set: processedUpdateData },
            { new: true, runValidators: true } 
        );

        if (!updatedTour) {
            return res.status(404).json({ message: 'Update failed, tour not found.' });
        }

        console.log("[Update] Success. Price auto-calculated by Schema Middleware.");
        res.json(updatedTour);
    } catch (err) {
        console.error("[Update] Error:", err.message);
        res.status(400).json({ message: "Update failed: " + err.message });
    }
};

// @desc    delete tours (Admin Only)
// @route   DELETE /api/tours/:id
exports.deleteTour = async (req, res) => {
    try {
        console.log(`[Delete] Attempting to delete ID: ${req.params.id}`);
        
        const tour = await Tour.findById(req.params.id);

        if (!tour) {
            console.log("[Delete] Tour not found");
            return res.status(404).json({ message: 'The trip cannot be found and cannot be deleted.' });
        }

        await Tour.findByIdAndDelete(req.params.id);

        console.log("[Delete] Successful");
        res.json({ message: 'The tour has been successfully deleted.' });
    } catch (err) {
        console.error("[Delete] Error:", err.message);
        res.status(500).json({ message: "Server error, deletion failed." });
    }
};