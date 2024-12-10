const express = require("express")
const { login, verifyOtp } = require("../controllers/CustomerController")
const router  = express.Router()

router.route("/customer/signin").post(login)
router.route("/customer/verifyOtp").post(verifyOtp)

module.exports = router