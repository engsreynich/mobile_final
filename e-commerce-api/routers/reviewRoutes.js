const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


router.get('/', async (req, res) => {
    const reviews = await Review.find();

    res.status(200).json(reviews);
});

router.post('/', async (req, res) =>{
    try {
        const { product, user, rating, comment } = req.body;

        if (!product || !user || !rating) {
            return res.status(400).json({ message: 'Product, user, and rating are required.' });
        }

        const newReview = new Review({ product, user, rating, comment });
        const savedReview = await newReview.save();

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error });
    }
});

router.get('/productId', async (req,res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate('user', 'name email');

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviews', error });
    }
});


module.exports = router;

// Create a Review
// Endpoint: POST /api/reviews
// {
//     "product": "productId",
//     "user": "userId",
//     "rating": 4,
//     "comment": "Great product!"
// }

// Get Reviews by Product
// Endpoint: GET /api/reviews/:productId

// Update a Review
// Endpoint: PUT /api/reviews/:reviewId
// {
//     "rating": 5,
//     "comment": "Updated review comment."
// }

// Delete a Review
// Endpoint: DELETE /api/reviews/:reviewId