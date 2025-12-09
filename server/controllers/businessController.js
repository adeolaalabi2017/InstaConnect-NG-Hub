const Business = require('../models/Business');

// @desc    Get all businesses
// @route   GET /api/businesses
exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find({ isOpen: true });
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
exports.getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id).populate('ownerId', 'name email');
        if (business) {
            res.json(business);
        } else {
            res.status(404).json({ message: 'Business not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a business
// @route   POST /api/businesses
exports.createBusiness = async (req, res) => {
    try {
        const business = new Business({
            ...req.body,
            ownerId: req.user._id
        });

        const createdBusiness = await business.save();
        res.status(201).json(createdBusiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
