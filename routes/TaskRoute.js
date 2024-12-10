const express = require("express")
const {createTasks, getTasks, getSingleTasks, deleteTasks, tasksDashboard, getStaffs, updateTasks} = require("../controllers/TaskController")
const {authenticate} = require("../middlewares/Authenticate")
const router = express.Router()

router.route("/task").post(authenticate,createTasks).get(authenticate,getTasks)
router.route("/task/:id").get(authenticate,getSingleTasks).delete(authenticate,deleteTasks)
router.route("/tasks/dashboard").get(authenticate,tasksDashboard)
router.route("/tasks/getStaffs").get(getStaffs)
router.route("/tasks/update/:id").put(updateTasks)


module.exports = router