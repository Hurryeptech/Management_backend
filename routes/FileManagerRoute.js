const express = require("express");
const router = express.Router();
const {
  GetFile,
  PostFile,
  Updatefile,
  DeleteFile,
} = require("../controllers/FileManagerController");
const cloudinary = require("../utils/Cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crm", // upload folder name
    resource_type: "auto",
  },
});

const parser = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});
router
  .route("/filemanage/file/:id?")
  .get(GetFile)
  .post(parser.single("file"), PostFile)
  .put(Updatefile)
  .delete(DeleteFile);

module.exports = router;