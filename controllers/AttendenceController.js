const attendenceModel = require("../models/AttendenceModel")
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const ErrorHandler = require("../utils/ErrorHandler")
const moment = require("moment")

exports.createCheckin = CatchAsyncError(async(req,res)=>{
   
    const user = req.user
    const today = new Date()
    const check = new Date(today.getFullYear(),today.getMonth(),today.getDate())
 
    const checkin = await attendenceModel.create({date: check,checkin: today,user: user.id,status: 'active'})

    res.status(201).json({
        success: true,
        checkin
    })

})

exports.getCheckins = CatchAsyncError(async(req,res,next)=>{

    const user = req.user

    const today = new Date('2025-03-28')
    const check = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    let checkins = await attendenceModel.findOne({user: user.id,checkin:{$exists: true},checkout:{$exists:false}})
  
    if(!checkins)
    {
        checkins = undefined
    }
  
    res.status(200).json({
        success: true,
        checkins
    })
})

exports.checkout = CatchAsyncError(async(req,res,next)=>{

    const user = req.user

    const today = new Date()
    const check = new Date(today.getFullYear(),today.getMonth(),today.getDate())
 
    const checkoutUpdate = await attendenceModel.findOne({date: check,user: user.id}).sort({_id: -1})
    checkoutUpdate.checkout=new Date()
    checkoutUpdate.status='check-out'
   checkoutUpdate.status = 'checkout'
   checkoutUpdate.save()
    if(!checkoutUpdate)
    {
        return next(new ErrorHandler("not a valid log",400))
    }
    res.status(200).json({
        success: true
    })
})

exports.pauseTimer = CatchAsyncError(async(req,res)=>{

 
    const user = req.user
    const today = new Date()
    const to = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    const time = await attendenceModel.findOne({date: to,user: user.id}).sort({_id:-1})
time.pausedTimes.push(new Date())
time.status = 'away'
time.isPaused= true
await time.save()
    
    
    res.json({
        success: true
    })
})

exports.resumeTimer = CatchAsyncError(async(req,res)=>{

    const today = new Date()
    const user = req.user
    const to = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    const time = await attendenceModel.findOne({date: to,user: user.id}).sort({_id:-1})

    time.resumedTimes.push(new Date())
time.status = 'active'
time.isPaused= false
  await time.save()

    res.json({
        success: true
    })
})

exports.getAllUsersLogin = CatchAsyncError(async(req,res)=>{


    const attendence = await attendenceModel.find().populate({path:'user',select:'firstName'})
  
    if(attendence.length < 0)
    {
        return next(new ErrorHandler("No Data Found",404))
    }

    res.status(200).json({
        success: true,
        attendence
    })
})

exports.deleteCheckin = CatchAsyncError(async(req,res)=>{

    const id=req.params

    const dele= await attendenceModel.findByIdAndDelete(id)
    res.json({
        success: true
    })
})

exports.getUserLogin = CatchAsyncError(async(req,res)=>{

    const user = req.user
    const attendence = await attendenceModel.find({user: user.id}).populate({path:'user',select:'firstName'})

    if(attendence.length < 0)
        {
            return next(new ErrorHandler("No Data Found",404))
        }
    
        res.status(200).json({
            success: true,
            attendence
        })

})