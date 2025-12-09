const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    rawEvents: [{ type: Object }] // Optional: store raw events if needed
}, { timestamps: true });

// Composite index for fast lookups
analyticsSchema.index({ date: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
