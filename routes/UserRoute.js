const express = require("express")
const { signup, signin, verifyOtp, viewProfile, sendMailNew, requestLeave, getUserLeaveHistory, dashboard, updateProfile, viewScoialProfile } = require("../controllers/UserController")
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


router.route("/user/sendMailNew").post(sendMailNew)
router.route("/user/signup").post(signup)
router.route("/user/signin").post(signin)
router.route("/user/verifyOtp").post(verifyOtp)
router.route("/user/viewProfile").get(authenticate,viewProfile)
router.route("/user/viewSocilaProfile/:email").get(viewScoialProfile)
router.route("/user/requestLeave").post(authenticate,requestLeave)
router.route("/user/getAnnouncements").put(authenticate,getAnnouncements)
router.route("/user/leaveHistory").get(authenticate,getUserLeaveHistory)
router.route("/user/dashboard").get(authenticate,dashboard)
router.route("/user/updateProfile").put(authenticate,upload.single('image'),updateProfile)
module.exports = router