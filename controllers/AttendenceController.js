const CatchAsyncError = require("../middlewares/CatchAsyncError")
const AttendenceModel = require("../models/AttendenceModel")
const HolidayModel = require("../models/HolidayModel")
const ErrorHandler = require("../utils/ErrorHandler")
const moment = require("moment")

// exports.login = CatchAsyncError(async(req,res,next)=>{

//     const user = req.user
//     const{date,time} = req.body

//     const loginTime = await AttendenceModel.create({
//         date: date,
//         time: time,
//         user: user
//     })

//     if(!loginTime)
//     {
//         return next(new ErrorHandler("Some error in adding login time",500))
//     }

//     res.status(201).json({
//         success: true,
//         message: "Login time added"
//     })
// })


exports.logout = CatchAsyncError(async(req,res,next)=>{

    const today= new Date()
    const logoutTime = Date.now()
    const dat = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    const  user = req.user
    const logoutUser = await AttendenceModel.findOne({date: dat,user: user.id})

    if(!logoutUser)
        {
            return next(new ErrorHandler("Log in First to logout",400))
        }


    if(logoutUser.logoutTime)
    {
        return next(new ErrorHandler("already Logged out",400))
    }
   

    logoutUser.logoutTime = logoutTime
    const diff = (((logoutUser.logoutTime - logoutUser.loginTime) / 1000 /60 /60) %24)


    if(diff <= 4)
    {
        if(user.paidLeave > 0)
        {
            user.paidLeave -= 1
            logoutUser.status = "Paid Leave"
        }
        else if(user.sickLeave > 0)
        {
            user.sickLeave -= 1
            logoutUser.status = "Sick Leave"
        }
        else
        {
            logoutUser.status = "Absent"
        }
        
    }
    else if(diff <= 7)
    {
 
        logoutUser.status = "HalfDay"
    }
    else
    {
        
        logoutUser.status = "Present"
    }
    await user.save()
    await logoutUser.save()
    res.status(201).json({
        success: true,
        message: "Logout time added",
        logoutUser
    })
})

exports.AttendenceAnalysis = CatchAsyncError(async(req,res,next)=>{

    const {userEmail,_id} = req.user
    const user = req.user
    const today = new Date()
    const firstdate = new Date(today.getFullYear(),today.getMonth(), 1, 0, 0, 0)
    const lastDate = new Date(today.getFullYear(),today.getMonth()+1, 0, 23, 59, 59, 999)
// const logs1 = await AttendenceModel.find({user: user.id,loginTime:{$gte: firstdate,$lte: lastDate}})

   const logs = await AttendenceModel.aggregate([
{
    $match:{
        user: user._id,
        loginTime:{$gte : firstdate, $lte: lastDate}
        
    }
 }   ,
    {
        $facet:{
            pres:[
                {
                 $match:{
                    status: "Present"
                 }
                },
                {
                    $count: "count"
                }
            ],
            abs:[
                {
                    $match:{
                        status:"Absent"
                    }
                },
                {
                    $count:"count"
                }
            ]   ,
            half:[
                {
                    $match:{
                        status: "HalfDay"
                    }
                },
                {
                    $count: "count"
                }
            ],
            paid:[
                {
                    $match:{
                        status: "Paid Leave"
                    }
                },
                {
                    $count: "count"
                }
            ],
            sick:[
                {
                    $match:{
                        status: "Sick Leave"
                    }
                },
                {
                    $count: "count"
                }
            ]
        }
    }
   ])

   const present = logs[0]?.pres[0]?.count ?? 0
   const absent = logs[0]?.abs[0]?.count ?? 0
   const half = logs[0]?.half[0]?.count ?? 0
   const paid = logs[0]?.paid[0]?.count ?? 0
   const sick = logs[0]?.sick[0]?.count ?? 0
   const paidRemaining = user.paidLeave
   const sickRemaining = user.sickLeave
    res.json({
        present: present,
        absent: absent,
        half: half ,
        paidTaken: paid,
        sickTaken: sick,
        paidRemaining,sickRemaining
    })
 
})

exports.AttendenceDetails = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.user
    const today = new Date()
    const firstdate = new Date(today.getFullYear(),today.getMonth(), 1, 0, 0, 0)
    const lastDate = new Date(today.getFullYear(),today.getMonth()+1, 0, 23, 59, 59, 999)
 
    const details = await AttendenceModel.find({user: id,loginTime:{$gte: firstdate,$lte: lastDate}}).sort({_id: -1})

    if(!details)
    {
        return next(new ErrorHandler("No Details Present in Database",404))
    }

    res.status(200).json({
        success: true,
        details
    })
})