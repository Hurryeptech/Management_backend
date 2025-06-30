const express = require("express")
const { signup, signin, verifyOtp, viewProfile, sendMailNew, requestLeave, getUserLeaveHistory, dashboard, updateProfile, viewScoialProfile, updatePermissions, getPermissions, gSignin, getUserDetails, addAllowance, editAllowance, deleteAllowance, getAllAllowance, addPayroll, editPayroll, deletePayroll, getAllPayroll } = require("../controllers/UserController")
const {getAnnouncements} = require("../controllers/AnnouncementController")
const {authenticate} = require("../middlewares/Authenticate")
const router = express.Router()
const multer = require("multer")
const fs = require("fs-extra")
const path = require("path")
const { createLead, getLead, getSingleLead, updateLead, getAddress, checkEmail } = require("../controllers/LeadController")
 

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

router.post('/user/addallowance', addAllowance);
router.put('/user/editallowance', editAllowance);
router.delete('/user/deleteallowance', deleteAllowance);
router.get('/user/getallowance', getAllAllowance);
router.post('/user/addpayroll', addPayroll);
router.put('/user/editpayroll', editPayroll);
router.delete('/user/deletepayroll', deletePayroll);
router.get('/user/getpayroll', getAllPayroll);


router.route("/user/leads").post(createLead).get(getLead)
router.route("/user/lead/:leadId").get(getSingleLead).put(updateLead)
router.route("/user/getaddress/:pincode").get(getAddress)
router.route("/user/leads/checkEmail/:email").get(checkEmail)
router.route("/user/getUserDetails/:id").get(getUserDetails)

module.exports = router