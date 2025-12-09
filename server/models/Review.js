const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String }, // redundant for easy display
    userImage: { type: String }, // redundant
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    helpfulCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'flagged', 'hidden'], default: 'active' },
    photos: [{ type: String }],
    reply: {
        text: { type: String },
        date: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
