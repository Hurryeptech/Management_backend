const CatchAsyncError = require("../middlewares/CatchAsyncError")
const EventModel = require("../models/EventModel")
const ErrorHandler = require("../utils/ErrorHandler")
const nodemailer = require("nodemailer")
const SendMail = require("../utils/SendEmail")
const moment = require("moment")
const UserModel = require("../models/UserModel")
const { default: mongoose } = require("mongoose")


exports.addEvent = CatchAsyncError(async(req,res,next)=>{

    
    const {id}= req.admin
 
    // const {userEmail} = req.user
    const createEvent = await EventModel.create(req.body)

    if(!createEvent)
    {
        return next(new ErrorHandler("Some Error in Adding Event",408))
    }

    const options = {
        user:"msdsuren07@gmail.com",
        pass:process.env.GMAIL_PASS
    }
    // const mail = SendMail(options)

    // if(!mail)
    // {
    //    return next(new ErrorHandler("Some Error In Sending Email",408))
    // }

    res.send(createEvent)

})

exports.getAllEvent = CatchAsyncError(async(req,res,next)=>{

    // const {id} = req.user

    const events  = await EventModel.find()
    
    

    if(!events)
    {
        return next(new ErrorHandler("No Events Found",200))
    }
    
    res.send(events)
    // res.status(200).json({
    //     success: true,
    //     message: "Displayed All Events",
    //     events
    // })
})


exports.updateEvents = CatchAsyncError(async(req,res,next)=>{

    
    const {event_id} = req.params
    const {title,start,end} = req.body
 

    const updatedEvent = await EventModel.findByIdAndUpdate(event_id,{title: title,start: start,end: end}, { new: true })

    if(!updatedEvent)
    {
        return next(new ErrorHandler("Error while updating",500))
    }

    res.json(updatedEvent)
})

exports.deleteEvent = CatchAsyncError(async(req,res,next)=>{

    const {event_id} = req.params
 
    const deleteEvent = await EventModel.findByIdAndDelete(event_id)

    if(!deleteEvent)
        {
            return next(new ErrorHandler("Error while updating",500))
        }

    res.json(deleteEvent)
})

exports.filterCalender = CatchAsyncError(async(req,res)=>{

    const option = false
    const user =req.user
    const today = new Date()
    const date = new Date(Date.UTC(today.getFullYear(),today.getMonth(),1))
    const enddate = new Date(Date.UTC(today.getFullYear(),today.getMonth()+1,0))
  
//    const filter = await EventModel.aggregate([
  
//     {
//         $lookup:{
//             from:"tasks",
//             localField: "start",
//             foreignField: "endDate",
//             as:"details"
//         }
//     }
//    ])

const stringsd = "Hello"

     const filter = await EventModel.aggregate([
    
        {
            $unionWith: { coll: "tasks", pipeline: [ { $match: { endDate: {$gte: date,$lte: enddate} } } ] } , 
        
        }
      
     ])


res.json({
    success: true,
    filter
})
})

exports.filter = CatchAsyncError(async(req,res)=>{
 
 const {event} = req.params

    // const event = ['tasks','events']
     const collections = ['tasks','events']



     let events=''
    
    //  const ms = collections.filter((fil)=> fil!== event.at(0))
   
     const cols= collections.filter((col)=> event.includes(col)).map((col)=>({
   
        $unionWith:{coll: col}
     }
     ))
     
     if(cols.length > 0)
     {
         events = await EventModel.aggregate([cols])
    //   events=   mongoose.connection.collection(`${event[0]}`).aggregate([cols])
     }
     if(!event.includes('event'))
     {
        events = events.filter((fil)=>{return fil.type!== 'event'})
     }
     res.json({
        success: true,
        events
     })
})