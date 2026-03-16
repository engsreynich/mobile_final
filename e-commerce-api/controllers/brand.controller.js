const Brand = require("../models/Brand");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const mongoose = require("mongoose");

// Helper for uploading buffer to Cloudinary
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

exports.createBrand = async (req, res) => {
  try {
    let imageUrl;
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const brand = new Brand({
      ...req.body,
      createdBy: req.user.id,
      image: imageUrl,
    });

    const savedBrand = await brand.save();
    res.status(201).json({ success: true, data: savedBrand });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const brandsWithProductCount = await Brand.aggregate([
      { $match: { createdBy: userId } },
      {
        $lookup: {
          from: "products",
          let: { brandId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$brand", "$$brandId"] },
                    { $eq: ["$createdBy", userId] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "productStats",
        },
      },
      {
        $addFields: {
          totalProducts: {
            $ifNull: [{ $arrayElemAt: ["$productStats.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          productStats: 0,
          createdBy: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: brandsWithProductCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      updatedData.image = uploadResult.secure_url;
    }

    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!brand) return res.status(404).json({ error: "Brand not found" });

    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res
      .status(200)
      .json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
