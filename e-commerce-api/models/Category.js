const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    parentCategory: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;