const express = require("express")
const { createProject, getProjects, getSingleProject, updateProject, getNameProjects, getProjectTasks, tasksDashboard, projectDashboard } = require("../controllers/ProjectController")
const {authenticate} = require("../middlewares/Authenticate")
const router = express.Router()



router.route("/project/:projectId?").post(authenticate,createProject).get(authenticate,getProjects).put(authenticate,updateProject)
router.route("/projects/getNames").get(authenticate,getNameProjects)
router.route("/projects/getTasks/:id").get(authenticate,getProjectTasks)
router.route("/projects/tasks/dashboard/:id").get(authenticate,tasksDashboard)
router.route("/projects/dashboard").get(authenticate,projectDashboard)
// router.route("/project/getSingle/:projectId").get(getSingleProject)

module.exports = router