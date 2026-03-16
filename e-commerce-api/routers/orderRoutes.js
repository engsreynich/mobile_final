const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

router.post("/place-order", async (req, res) => {
  try {
    const { userId, items, shippingAddress, latitude, longitude } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount: items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      shippingAddress,
      status: "pending",
      riderLocation: { type: "Point", coordinates: [longitude, latitude] },
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.patch("/:orderId/update-location", async (req, res) => {
  const { orderId } = req.params;
  const { longitude, latitude } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.riderLocation = { type: "Point", coordinates: [longitude, latitude] };
    await order.save();

    res
      .status(200)
      .json({ message: "Rider location updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:orderId/track", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      success: true,
      location: order.driverLocation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        error:
          "Order not found or you do not have permission to delete this order.",
      });
    }
    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        error:
          "Order not found or you do not have permission to cancel this order.",
      });
    }

    if (["complete", "shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        error: "This order cannot be cancelled at its current status.",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Items are required and must be a non-empty array." });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required." });
    }

    // Fetch all products in one query
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Check if all products exist
    if (products.length !== items.length) {
      return res.status(404).json({ error: "One or more products not found." });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      const quantity = item.quantity || 1;

      totalAmount += product.price * quantity;

      return {
        product: product._id,
        quantity,
        price: product.price,
      };
    });

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    const savedOrder = await order.save();
    res
      .status(201)
      .json({ message: "Order created successfully", data: savedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price category");

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
