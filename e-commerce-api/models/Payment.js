const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['credit_card','paypal', 'bank_transfer'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded' ],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
    },
},{timestamps: true});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;