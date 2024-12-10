const express = require("express")
const { addEvent, getAllEvent, updateEvents, deleteEvent, filterCalender, filter } = require("../controllers/EventController")
const {authenticate, authenticateAdmin} = require("../middlewares/Authenticate")

const router = express.Router()

router.route("/event/addEvent").post(authenticateAdmin,addEvent)
router.route("/event/getAllEvent").get(authenticate,getAllEvent)
router.route("/event/updateEvent/:event_id").put(authenticateAdmin,updateEvents)
router.route("/event/deleteEvent/:event_id").delete(authenticateAdmin,deleteEvent)


router.route("/event/filterall").get(filterCalender)
router.route("/event/filter/:event").get(filter)

module.exports = router