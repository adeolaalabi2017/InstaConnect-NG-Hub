const User = require('../models/User');
const Business = require('../models/Business');

// @desc    Get Admin Overview Stats
// @route   GET /api/admin/overview
exports.getAdminOverview = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBusinesses = await Business.countDocuments();
        const activeBusinesses = await Business.countDocuments({ isOpen: true });

        // Mock revenue for now as Transactions model isn't populated
        const totalRevenue = 1250000;
        const monthlyRevenue = 450000;

        res.json({
            totalUsers,
            totalBusinesses,
            activeBusinesses,
            totalRevenue,
            monthlyRevenue,
            activeUsersNow: Math.floor(Math.random() * 50) + 100, // Still mock
            trends: {
                users: { value: 12, isPositive: true },
                business: { value: 5, isPositive: true },
                revenue: { value: 8, isPositive: true }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
