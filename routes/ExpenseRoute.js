const express = require("express");
const {
  getExpense,
  postExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/ExpenseController");
const router = express.Router();
const {authenticate, authenticateAdmin} = require("../middlewares/Authenticate")
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

router.get('/expenses/getexpense',authenticate,getExpense)
router.post('/expenses/applyexpense',upload.single("uploadFile"),authenticate,postExpense)
router.put('/expenses/updateexpense',upload.single("uploadFile"),authenticate,updateExpense)
router.delete('/expenses/deleteexpense',authenticate,deleteExpense)

module.exports = router;