const express = require("express")
const {createTasks, getTasks, getSingleTasks, deleteTasks, tasksDashboard, getStaffs, updateTasks, deleteComment} = require("../controllers/TaskController")
const {authenticate} = require("../middlewares/Authenticate")
const multer=require("multer")
const path = require("path")
const fs= require("fs")
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
  filename: (req, file, cb,next) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log('Generating unique filename:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



router.route("/task").post(upload.array('attachements','3'),authenticate,createTasks).get(authenticate,getTasks)
router.route("/task/:id").put(upload.array('attachments','2'),authenticate,updateTasks).get(authenticate,getSingleTasks)
router.route("/tasks/dashboard/:id?").get(authenticate,tasksDashboard)
router.route("/tasks/getStaffs").get(authenticate,getStaffs)
router.route("/tasks/comment/:id").delete(authenticate,deleteComment)
// router.route("/tasks/update/:id").put(updateTasks)


module.exports = router