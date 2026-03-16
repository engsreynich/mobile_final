const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const storage = multer.memoryStorage();
const streamifier = require("streamifier");
const upload = multer({ storage });
const mongoose = require("mongoose");
router.get("/", async (req, res) => {
  try {
    const {
      search,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
      ratings,
      topSelling,
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (categoryId) query.categoryId = categoryId;
    if (brand) query.brand = brand;
    if (ratings) query.ratings = { $gte: Number(ratings) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let mongooseQuery = Product.find(query);

    if (sort) {
      const sortBy = sort.startsWith("-")
        ? { [sort.slice(1)]: -1 }
        : { [sort]: 1 };
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else if (topSelling === "true") {
      mongooseQuery = mongooseQuery.sort({ ratings: -1 });
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }
    const skip = (page - 1) * limit;
    mongooseQuery = mongooseQuery.skip(skip).limit(Number(limit));

    const [products, total] = await Promise.all([
      mongooseQuery.exec(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ categoryId });

    if (products.length === 0) {
      return res.status(404).json({
        error: "No products found for the specified category",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    const uploadResults = await Promise.all(
      req.files.map((file) => uploadFromBuffer(file.buffer))
    );
    const images = uploadResults.map((result) => ({ url: result.secure_url }));
    const product = new Product({
      ...req.body,
      createdBy: req.user.id,
      images,
    });
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.user.id;

    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      createdBy: createdBy,
    });

    if (!deletedProduct) {
      return res.status(404).json({
        error:
          "Product not found or you are not authorized to delete this product",
      });
    }

    res.json({
      message: "Product deleted successfully",
      products: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.user.id;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, createdBy: createdBy },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error:
          "Product not found or you are not authorized to update this product",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/my-products", async (req, res) => {
  try {
    const createdBy = req.user.id;

    const products = await Product.find({ createdBy })
      .populate({ path: "categoryId", select: "name" })
      .populate({ path: "brand", select: "name" });

    const stats = await Product.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(createdBy) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          outOfStock: {
            $sum: {
              $cond: [{ $eq: ["$stock", 0] }, 1, 0],
            },
          },
          activeProducts: {
            $sum: {
              $cond: [{ $eq: ["$isActive", true] }, 1, 0],
            },
          },
          inactiveProducts: {
            $sum: {
              $cond: [{ $eq: ["$isActive", false] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalProducts: 0,
      totalStock: 0,
      outOfStock: 0,
      activeProducts: 0,
      inactiveProducts: 0,
    };
    res.status(200).json({
      success: true,
      data: {
        products,
        stats: {
          totalProducts: result.totalProducts,
          totalStock: result.totalStock,
          outOfStock: result.outOfStock,
          inStock: result.totalProducts - result.outOfStock,
          activeProducts: result.activeProducts,
          inactiveProducts: result.inactiveProducts,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
