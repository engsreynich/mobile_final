const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    if (wishlist.products.length === 0) {
      return res.status(200).json({ message: "Wishlist is empty" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    const savedWishlist = await wishlist.save();

    await User.findByIdAndUpdate(
      userId,
      { wishlist: savedWishlist._id },
      { new: true }
    );

    res.status(201).json(savedWishlist);
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    const savedWishlist = await wishlist.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist", data: savedWishlist });
  } catch (error) {
    res.status(500).json({
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
});

module.exports = router;
