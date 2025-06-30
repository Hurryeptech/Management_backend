const express = require("express");
const router = express.Router();
const LeaveController = require("../controllers/LeaveController");
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

router.post("/leave", upload.single("file"), LeaveController.ApplyLeave);
router.get("/getleaves", LeaveController.getLeaves);
router.get("/getallleaves", LeaveController.getAllLeaves);
router.put("/updateleave/:id",upload.single("file"), LeaveController.updateLeave);
router.delete("/deleteleave", LeaveController.deleteLeave);
router.post("/resultleave",LeaveController.LeaveResult)
router.post("/cron",LeaveController.croncheck)
router.post("/delfile",LeaveController.DeleteFile)
// router.get("/getTotalLeaveRequests", LeaveController.GetTotalLeaveDays);
module.exports = router;