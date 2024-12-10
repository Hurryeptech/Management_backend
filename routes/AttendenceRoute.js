const express = require("express")
const {createCheckin, getCheckins, checkout, pauseTimer, resumeTimer, deleteCheckin, getUserLogin } = require("../controllers/AttendenceController")
const router = express.Router()
const {authenticate} = require("../middlewares/Authenticate")

router.route("/user/checkin").post(authenticate,createCheckin)
router.route("/user/details").get(authenticate,getCheckins)
router.route("/user/checkout").put(authenticate,checkout)
router.route("/user/pauseTimer").put(authenticate,pauseTimer)
router.route("/user/resumeTimer").put(authenticate,resumeTimer)
router.route("/user/deleteCheckin").delete(authenticate,deleteCheckin)
router.route("/user/getUserLogin").get(authenticate,getUserLogin)

module.exports = router