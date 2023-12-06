const express = require('express');
const protect = require('../middleWare/authMiddleware');
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { upload } = require('../utils/fileUpload');

const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct); 
// if we need to upload multiple we can use upload.array("image")
router.patch("/:id", protect, upload.single("image"), updateProduct);

router.get("/", protect , upload.single("image"), getProducts); 
router.get("/:id", protect, getProduct); 
router.delete("/:id", protect, deleteProduct);


module.exports = router;