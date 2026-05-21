const Tour = require('../models/Tour');
const TourFactory = require('../factories/tourFactory'); // import factory

// @desc    get all tours
// @route   GET /api/tours
exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find({}).sort({ createdAt: -1 });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: "Get tour failed.: " + err.message });
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
        console.log(`🔄 [Update] ID: ${req.params.id}`);
        
        // 1. Retrieve the "old data" of this trip from the database (to identify if it was a previous promo).
        const oldTour = await Tour.findById(req.params.id);
        if (!oldTour) {
            return res.status(404).json({ message: 'Update failed' });
        }

        // 2. Extract the type structure from req.body.
        const { type, ...restBody } = req.body;
        const updateData = { ...restBody };

        // If new photos were uploaded during the update, overwrite the imageUrl.
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            console.log("[Update] New image uploaded:", updateData.imageUrl);
        }

        // 3. Integrate the factory's business logic into the processing of the data that is about to be updated.
        const processedUpdateData = TourFactory.applyBusinessLogic(type, updateData, oldTour);

        // 4. Write the processed data (processedUpdateData) from the factory to the database.
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            { $set: processedUpdateData },
            { new: true, runValidators: true }
        );

        console.log("[Update] Success with Factory Logic");
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