const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: 'https://via.placeholder.com/150' },
    role: { type: String, enum: ['consumer', 'vendor', 'admin'], default: 'consumer' },
    credits: { type: Number, default: 0 },
    badges: [{ type: String }],
    reputationPoints: { type: Number, default: 0 },
    referralCode: { type: String },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
    },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Password Match Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash Password Middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
