const express = require("express")
const multer = require("multer")
const fs = require("fs-extra")
const path = require("path")
const { RegisterAdmin, LoginAdmin, VerifyOtp, GetUsersEmail, addUser, deleteUser, getUserDetails, getAllUsers, getLeaveNewRequests, giveLeaveStatus, getLeaveHistory, userProfile, adminDashboard} = require("../controllers/AdminController")
const { addHolidays, getHolidays, updateHoliday, deleteHoliday } = require("../controllers/HolidayController")
const {authenticateAdmin,authenticateRole} = require("../middlewares/Authenticate")
const router = express.Router()

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    console.log('Saving file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log('Generating unique filename:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/admin/addAdmin",RegisterAdmin)
router.post("/admin/loginAdmin",LoginAdmin)
router.post("/admin/verifyAdmin",VerifyOtp)
router.get("/admin/getUsersEmail",authenticateAdmin,authenticateRole('admin'),GetUsersEmail)

router.get("/admin/getUserDetails/:id",getUserDetails)


router.post("/admin/addHolidays",addHolidays)
router.get("/getHolidays",getHolidays)
router.put("/admin/updateHolidays",updateHoliday)
router.delete("/admin/deleteHolidays/:id",deleteHoliday)
router.post("/admin/addUser",upload.single('image'),addUser)
router.get("/admin/getAllUsers",getAllUsers)
router.delete("/admin/deleteUser/:id",deleteUser)

router.get("/admin/getNewLeaves",getLeaveNewRequests)
router.put("/admin/updateLeaveStatus/:id",giveLeaveStatus)
router.get("/admin/getLeaveHistory",getLeaveHistory)
router.get("/admin/userProfile/:id",userProfile)
router.get("/admin/dashboard",adminDashboard)
module.exports = router