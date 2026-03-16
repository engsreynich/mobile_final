const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brand.controller");
const authMiddleware = require("../Middleware/auth-middlewar");
const multer = require("multer");
const upload = multer();

router.use(authMiddleware);

router.get("/", brandController.getBrands);
router.get("/:id", brandController.getBrandById);
router.post("/", upload.single("image"), brandController.createBrand);
router.put("/:id", upload.single("image"), brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
