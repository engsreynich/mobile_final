const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shippingAddress: {
        street: String,
        city: String,
        country: String,
        postalCode: String,
    },
    riderLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
orderSchema.index({ riderLocation: '2dsphere' });
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
