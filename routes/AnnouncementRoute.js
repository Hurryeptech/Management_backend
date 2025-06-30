const express = require("express")
const { createAnnouncement, updateAnnouncement, getAnnouncements, markAsRead } = require("../controllers/AnnouncementController")
const {authenticate}= require("../middlewares/Authenticate")
const router = express.Router()

// router.post("/admin/createAnnouncement",createAnnouncement)
router.put("/admin/updateAnnouncement",updateAnnouncement)
router.put("/user/getAnnouncements",authenticate,getAnnouncements)
router.put("/user/markRead",authenticate,markAsRead)
module.exports = router

