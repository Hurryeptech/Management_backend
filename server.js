
const app = require("./index.js")
const mongoose = require("mongoose")
const AnnouncementModel = require("./models/AnnouncementModel.js")
const server = require("http").createServer(app)
const cors= require("cors")
const io = require("socket.io")(server,{
    cors:{
        origin:'*'
    }
})
let conn = null
io.on('connection',(socket)=>{

   console.log("connected",socket.id)
 
   })  


app.post('/api/v1/admin/createAnnouncement',async (req,res)=>{
    const {date,title,description} = req.body
    const announcement = await AnnouncementModel.create({date,title,description})

    if(!announcement)
    {
        return next(new ErrorHandler("Error in creating records",400))
    }
      
        io.emit('Receive',"Event added successfully")
    
  

    res.status(201).json({
        success: true
    })
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Mongodb Connected")
})


server.listen(process.env.PORT,()=>{
    console.log("Server Started",process.env.PORT)
})