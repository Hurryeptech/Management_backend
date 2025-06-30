const multer = require("multer");
const path = require("path");
const CompanyProfile = require("../models/CompanyProfileModel");
const CatchAsyncError = require("../middlewares/CatchAsyncError");
const fs = require("fs");

exports.AddCompanyProfile = CatchAsyncError(async (req, res) => {
  try {
    const {
      companyname,
      email,
      address,
      city,
      country,
      state,
      phone,
      gst,
      zip,
    } = req.body;

    const filePath = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          "\\",
          "/"
        )}`
      : "";

    const newProfile = new CompanyProfile({
      companyname,
      email,
      address,
      city,
      country,
      state,
      phone,
      gst,
      zip,
      file: filePath, // ✅ Save file path
    });

    await newProfile.save();
    res.json({ message: "Profile Created", profile: newProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Profile
exports.GetCompanyProfile = CatchAsyncError(async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
  exports.UpdateCompanyProfile = CatchAsyncError(async (req, res) => {
    const { profileId } = req.query;
    try {
      const profile = await CompanyProfile.findById(profileId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });

      const updatedData = { ...req.body };

      if (req.file) {
        if (profile.file) {
          const oldPath = path.join(__dirname, "..", "uploads", profile.file);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updatedData.file = `${req.protocol}://${req.get(
          "host"
        )}/${req.file.path.replace("\\", "/")}`;
      } else if (updatedData.removeFile === "true" && !req.file && profile.file) {
        const oldPath = path.join(__dirname, "..", "uploads", profile.file);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
        profile.file = undefined;
      } else {
        updatedData.file = profile.file; 
      }
      await profile.save();
      const updatedProfile = await CompanyProfile.findByIdAndUpdate(
        profileId,
        updatedData,
        { new: true }
      );
      res.json({ message: "Profile Updated", profile: updatedProfile });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
