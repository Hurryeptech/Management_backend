const express = require("express")
const { signup, signin, verifyOtp, viewProfile, sendMailNew, requestLeave, getUserLeaveHistory, dashboard, updateProfile, viewScoialProfile, updatePermissions, getPermissions, gSignin } = require("../controllers/UserController")
const {getAnnouncements} = require("../controllers/AnnouncementController")
const {authenticate} = require("../middlewares/Authenticate")
const router = express.Router()
const multer = require("multer")
const fs = require("fs-extra")
const path = require("path")
 

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    console.log('Saving file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb,next) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log('Generating unique filename:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



router.route("/user/gSignin").post(gSignin)
router.route("/user/signin").post(signin)
router.route("/user/verifyOtp").post(verifyOtp)
router.route("/user/viewProfile").get(authenticate,viewProfile)
router.route("/user/requestLeave").post(authenticate,requestLeave)
router.route("/user/permissions/:id").put(authenticate,updatePermissions)
router.route("/user/getPermissions/:id").get(authenticate,getPermissions)
module.exports = router