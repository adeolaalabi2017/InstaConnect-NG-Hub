const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    priceRange: { type: String },
    isOpen: { type: Boolean, default: true },
    tags: [{ type: String }],
    phone: { type: String },
    email: { type: String },
    instagramHandle: { type: String },
    whatsapp: { type: String },
    viewCount: { type: Number, default: 0 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPromoted: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    credits: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
