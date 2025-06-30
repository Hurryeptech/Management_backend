const express = require("express")
const { login, verifyOtp, addCustomer, getAllCustomers, getCustomers } = require("../controllers/CustomerController")
const router  = express.Router()

router.route("/customer/signin").post(login)
router.route("/customer/verifyOtp").post(verifyOtp)
// router.route("/admin/addCustomer").post(addCustomer);
router.route("/admin/getCustomers").get(getAllCustomers)
router.route("/customer/getNames").get(getCustomers)
module.exports = router