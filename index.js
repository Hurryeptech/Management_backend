const express = require("express")
const app = express()
const dotenv  = require("dotenv")
const path = require("path")
const cors = require("cors")
const ErrorMiddleWare = require("./middlewares/error")
const {cronJob,cronJob2} = require("./utils/Cron")


dotenv.config({path: path.join(__dirname,"./.env")})

app.use(express.json())

app.use(express.urlencoded({ extended: true }));
  
app.use(cors())
app.use(
    cors({
      origin:"*",
    })
  );
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });

const EventRoute = require("./routes/EventRoute")
const UserRoute = require("./routes/UserRoute")
const TaskRoute = require("./routes/TaskRoute")
const TeamRoute = require("./routes/TeamRoute")
const SpreadsheetRoute = require("./routes/SpreadsheetRoute")
const AttendenceRoute = require("./routes/AttendenceRoute")
const AdminRoute = require("./routes/AdminRoute")
const AnnouncementRoute = require("./routes/AnnouncementRoute")
app.use("/api/v1",EventRoute)
app.use("/api/v1",UserRoute)
app.use("/api/v1",TaskRoute)
app.use("/api/v1",TeamRoute)
app.use("/api/v1",SpreadsheetRoute)
app.use("/api/v1",AttendenceRoute)
app.use("/api/v1",AdminRoute)
app.use("/api/v1",AnnouncementRoute)
app.use(ErrorMiddleWare)


module.exports = app