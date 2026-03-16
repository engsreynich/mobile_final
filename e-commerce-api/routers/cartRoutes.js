const express = require("express");
const Cart = require("../models/Cart");
const User = require("../models/User");
const authMiddleware = require("../Middleware/auth-middlewar");
const router = express.Router();

// Add item to cart (or update quantity if exists)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!userId || !items || !items[0]?.product || !items[0]?.quantity) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === items[0].product
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += items[0].quantity;
      } else {
        cart.items.push({
          product: items[0].product,
          quantity: items[0].quantity,
        });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{
          product: items[0].product,
          quantity: items[0].quantity,
        }],
      });
      await User.findByIdAndUpdate(userId, { cart: cart._id });
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
});

// Get user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

// Update item quantity in cart
router.patch("/items/:itemId", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity == null || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    cart.items[itemIndex].quantity = quantity;
    const updatedCart = await cart.save();

    res.status(200).json({ 
      message: "Quantity updated successfully",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

// Delete entire cart
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart", error: error.message });
  }
});

// Remove item from cart
router.delete("/items/:itemId", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ 
      message: "Item removed successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
});

module.exports = router;