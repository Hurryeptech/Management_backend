const File = require("../models/FileManagerModel");
const User = require("../models/AdminModel");
const CatchAsyncError = require("../middlewares/CatchAsyncError");
const cloudinary = require('../utils/Cloudinary')

exports.GetFile = CatchAsyncError(async (req, res) => {
  const { userId } = req.query;

  const getfile = await File.findOne({ userId });

  if (getfile) {
    res.status(200).json({ message: "File found", getfile });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});



exports.PostFile = CatchAsyncError(async (req, res) => {
  const { originalname } = req.file;
  const { userId, username } = req.query;

  // Cloudinary returns full info in req.file
  const fileUrl = req.file.path;
  const cloudinaryPublicId = req.file.filename; // <-- this is the public_id from cloudinary

  const filedetails = await File.findOne({ userId });
  const filedata = {
    filename: originalname,
    uploadedAt: new Date(),
    url: fileUrl,
    public_id: cloudinaryPublicId, // <-- add this line
  };

  if (filedetails) {
    filedetails.file.push(filedata);
    await filedetails.save();
    return res.status(200).json({
      message: `${originalname} uploaded successfully`,
      filedetails,
    });
  } else {
    const newFile = await File.create({
      userId,
      username,
      file: [filedata],
    });
    return res
      .status(200)
      .json({ message: "File uploaded successfully", newFile });
  }
});


exports.Updatefile = CatchAsyncError((req, res) => {});
exports.DeleteFile = CatchAsyncError(async(req, res) => {
  const { userId, public_id } = req.query;

  if (!public_id) {
    return res.status(400).json({ message: "Missing Cloudinary public_id" });
  }

  const fileDoc = await File.findOne({ userId });

  if (!fileDoc) {
    return res.status(404).json({ message: "User file data not found" });
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(public_id);

  // Remove file from MongoDB document
  fileDoc.file = fileDoc.file.filter((f) => f.public_id !== public_id);
  await fileDoc.save();

  return res.status(200).json({ message: "File deleted successfully" });
});