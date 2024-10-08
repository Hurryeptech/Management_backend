const CatchAsyncError = require("../middlewares/CatchAsyncError")
const EventModel = require("../models/EventModel")
const ErrorHandler = require("../utils/ErrorHandler")
const nodemailer = require("nodemailer")
const SendMail = require("../utils/SendEmail")
const moment = require("moment")
const UserModel = require("../models/UserModel")


exports.addEvent = CatchAsyncError(async(req,res,next)=>{

    const {title,start,end} = req.body
    const {id}= req.user

    // const {userEmail} = req.user

    const user = await UserModel.findById(id)
    if(!user)
    {
        return next(new ErrorHandler("No user Found",401))
    }
    const createEvent = await EventModel.create({title: title,start: start,end: end,user: user.id})

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

    const {userEmail} = req.user
    const user = await UserModel.findOne({userEmail: userEmail})
    const events  = await EventModel.find({user: user.id })
    

    

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
    console.log(req.params)
    const deleteEvent = await EventModel.findByIdAndDelete(event_id)

    if(!deleteEvent)
        {
            return next(new ErrorHandler("Error while updating",500))
        }

    res.json(deleteEvent)
})

