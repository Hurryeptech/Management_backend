const express = require("express")
const app = express()
const dotenv  = require("dotenv")
const path = require("path")
const cors = require("cors")
const ErrorMiddleWare = require("./middlewares/error")
const {cronJob,cronJob2} = require("./utils/Cron")
const cookieParser = require("cookie-parser")


dotenv.config({path: path.join(__dirname,"./.env")})

app.use(express.json())

app.use(express.urlencoded({ extended: true }));
  
// app.use(cors())
app.use(
    cors({
      origin:"http://localhost:3000",
      credentials: true
    })
  );
  app.use(cookieParser())
  // app.use((_req, res, next) => {
  //   res.header('Access-Control-Allow-Origin' , '*');
  //   res.header('Access-Control-Allow-Headers', '*');
  
  //   next();
  // });

const EventRoute = require("./routes/EventRoute")
const UserRoute = require("./routes/UserRoute")
const TaskRoute = require("./routes/TaskRoute")
const TeamRoute = require("./routes/TeamRoute")
const SpreadsheetRoute = require("./routes/SpreadsheetRoute")
const AttendenceRoute = require("./routes/AttendenceRoute")
const AdminRoute = require("./routes/AdminRoute")
const AnnouncementRoute = require("./routes/AnnouncementRoute")
const CustomerRoute = require("./routes/CustomerRoute")
const ProjectRoute = require("./routes/ProjectRoute")
const LeaveRoute = require("./routes/LeaveRoute")
const ExpenseRoute = require("./routes/ExpenseRoute")
const AssetRoute = require("./routes/AssetRoute")
const FileManagerRoute = require("./routes/FileManagerRoute")
const SalesRoute = require("./routes/SalesRoute");
const CompanyProfileRouter = require('./routes/CompanyProfileRoute')
app.use("/api/v1",EventRoute)
app.use("/api/v1",UserRoute)
app.use("/api/v1",TaskRoute)
app.use("/api/v1",TeamRoute)
app.use("/api/v1",SpreadsheetRoute)
app.use("/api/v1",AttendenceRoute)
app.use("/api/v1",AdminRoute)
app.use("/api/v1",AnnouncementRoute)
app.use("/api/v1",CustomerRoute)
app.use("/api/v1",ProjectRoute)
app.use("/api/v1",LeaveRoute)
app.use("/api/v1",ExpenseRoute)
app.use("/api/v1",AssetRoute)
app.use("/api/v1",FileManagerRoute)
app.use("/api/v1",SalesRoute)
app.use("/api/v1",CompanyProfileRouter)
app.use(ErrorMiddleWare)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/",(req,res)=>{
  res.send("Hello World")
})
module.exports = app