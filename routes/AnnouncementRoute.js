const express = require("express")
const { createAnnouncement, updateAnnouncement, getAnnouncements } = require("../controllers/AnnouncementController")
const {authenticate}= require("../middlewares/Authenticate")
const router = express.Router()

// router.post("/admin/createAnnouncement",createAnnouncement)
router.put("/admin/updateAnnouncement",updateAnnouncement)
router.put("/user/getAnnouncements",authenticate,getAnnouncements)

module.exports = router

