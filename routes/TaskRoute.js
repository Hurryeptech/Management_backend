const express = require("express")
const { getAllTasks, updateTasks, memberTaskUpdate } = require("../controllers/TaskController")
const {authenticate} = require("../middlewares/Authenticate")
const router = express.Router()

// router.route("/tasks/addTask/:id").post(addTask)
router.route("/tasks/getAllTasks").get(getAllTasks)
router.route("/tasks/updateTasks/:taskId").put(updateTasks)
// router.route("/tasks/deleteTasks/:id").delete(deleteTask)
router.route("/tasks/memberTaskUpdate/:id").put(authenticate,memberTaskUpdate)
module.exports = router