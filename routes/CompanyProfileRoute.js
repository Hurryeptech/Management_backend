const express = require("express");
const { model } = require("mongoose");
const CompanyProfile = require("../controllers/CompanyProfileController");
const {
  authenticate,
  authenticateAdmin,
} = require("../middlewares/Authenticate");
const router = express.Router();
const multer = require("multer");
const path= require('path')
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Save files in the 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
// });
router
  .route("/companyprofile/:profileId?")
  .post(authenticate,upload.single('file'), CompanyProfile.AddCompanyProfile)
  .get(authenticate, CompanyProfile.GetCompanyProfile)
  .put(authenticate,upload.single('file'), CompanyProfile.UpdateCompanyProfile);

module.exports = router;