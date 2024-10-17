const CatchAsyncError = require("../middlewares/CatchAsyncError")
const userModel = require("../models/UserModel")
const ErrorHandler = require("../utils/ErrorHandler")
const otplib = require("otplib")
const sendMail = require("../utils/SendEmail")
const SendToken = require("../utils/SendToken")
const AttendenceModel = require("../models/AttendenceModel")
const moment = require("moment")
const HolidayModel = require("../models/HolidayModel")
const cloudinary = require("../utils/Cloudinary")
const fs = require("fs-extra")
const LeaveModel = require("../models/LeaveModel")
const AnnouncementModel = require("../models/AnnouncementModel")
const SpreadsheetModel = require("../models/SpreadsheetModel")


exports.sendMailNew = CatchAsyncError(async(req,res)=>{

    const {userEmail} = req.body
    otplib.totp.options= {digits: 4,step: 120}
    const otp = otplib.totp.generate(userEmail+process.env.OTPLIB_SECRET)
    // sendMail()

    res.status(200).json({
        otp
    })
})

exports.signup = CatchAsyncError(async(req,res,next)=>{
    console.log("Hello Manoj")

    const {userName,userEmail,dob,position,mobile,otp,department,address} = req.body

    const verify = otplib.totp.check(otp,userEmail+process.env.OTPLIB_SECRET)
    if(!verify)
    {
        return next(new ErrorHandler("Incorrect Otp",401))
    }

    const imagePath = req.file.path

    const cloud = await cloudinary.uploader.upload(imagePath,{folder: 'profile'})
    const user = await userModel.create({
        userName,
        userEmail,
        dob,
        position,
        mobile,
        image: cloud.url,
        department,
        address
    },)
    
    if(!user)
    {
        return next(new ErrorHandler("Problem in Creating User",500))
    }

fs.remove(imagePath, err => {
  if (err) return console.error(err)
  console.log('profile Deleted!')
})

    res.status(201).json({
        success: true,
        message: "User Created",
        user
    })
})

exports.signin = CatchAsyncError(async(req,res,next)=>{
   

    const {userEmail,type} = req.body

    console.log("manoj")
    const validUser = await userModel.findOne({userEmail: userEmail})


    if(userEmail && type)
    {
     
        if(validUser)
        {
       return await handleAttendence(validUser,res)
        }
        else
        {
            const newUser = await userModel.create({userEmail,account_Type: type})
            console.log(newUser)
          return await  handleAttendence(newUser,res)
        }
    }

  
    if(!validUser)
    {
        return next(new ErrorHandler("Not a Valid User",401))
    }

    otplib.totp.options= {digits: 6,step: 120}
    const otp = otplib.totp.generate(userEmail+process.env.OTPLIB_SECRET)
    validUser.otp = otp
    validUser.otpExpire = new Date(Date.now() + 1 * 60 * 1000)
    validUser.save()


// const options = {
//         to: validUser.userEmail,
//         html: `<p> Verify Your Otp ${otp}`,
//         subject: "Otp For H-Management"
// }
// const mail = sendMail(options)

// if(!mail)
// {
//     return next(new ErrorHandler("Problem in Sending Mail",500))
// }

res.status(200).json({
    success: true,
    message: "Mail Sent Successfully",
    otp
})
})

exports.verifyOtp = CatchAsyncError(async(req,res,next)=>{

    const {otp,userEmail} = req.body

    const user = await userModel.findOne({userEmail: userEmail})
    if(user.otpExpire  < Date.now())
    {
        user.otpExpire = undefined,
        user.otp = undefined
        user.save()
        return next(new ErrorHandler("Time is exceeded",401))
    }

   

    if(otp !== user.otp)
    {
        return next(new ErrorHandler("Otp is Wrong",401))
    }

    user.otp = undefined
    user.otpExpire = undefined

    await user.save()

    if(!user)
    {
        return next(new ErrorHandler("Not a Valid User",401))
    }

  await  handleAttendence(user,res)

//     const today = new Date()
 
//     const last = await AttendenceModel.findOne({user: user.id}).sort({_id: -1})
//     if(last)
//     {
//     const diff =Math.abs(moment(last.date).diff(new Date(today.getFullYear(),today.getMonth(),today.getDate()),'days')) 
//     let da = last.date
//    let prev = new Date(today)
//       prev.setDate(today.getDate()-1)
//     console.log(da,diff,prev)
    
// const Holidays = await HolidayModel.find()
// let attendence=[]
//     if(diff > 1)
//     {
//         while(! moment(da).isSame(prev,'day'))
//         {

//             da.setDate(da.getDate()+1)
          
//             if(da.getDay()=== 0 || Holidays.some((dr)=>moment(dr.date).isSame(da,'day') ))
//             {
                
//             }
//             else
//             { 
//           attendence.push({date: new Date(da), status: "Absent",user: user.id})  
//             }
          
//         }
//         console.log(attendence)
//     }
//     if(attendence.length > 0)
//     {
//         const insert = await AttendenceModel.insertMany(attendence)
//     }
// }

//     const alreadyLoggedIn = await AttendenceModel.findOne({date:new Date(today.getFullYear(),today.getMonth(),today.getDate()) ,user: user.id})
    
//     if(!alreadyLoggedIn)
//     {
//     const attendence = await AttendenceModel.create({
//         date: new Date(today.getFullYear(),today.getMonth(),today.getDate()),
//         loginTime: Date.now(),
//         user: user.id
//     }) 
// }  



//     SendToken(user,res,200)


})


exports.viewProfile = CatchAsyncError(async(req,res,next)=>{

    const user = req.user

    

    res.status(200).json({
        success: true,
        message: "Logged in",
        user
    })
})

exports.viewScoialProfile = CatchAsyncError(async(req,res)=>{

    const userEmail = req.params.email

    const user = userModel.findOne({userEmail: userEmail})

    if(!user)
    {
        return next(new ErrorHandler("No user Found",401))
    }
    res.status(200).json({
        success: true,
        user
    })
})

exports.requestLeave = CatchAsyncError(async(req,res,next)=>{
    const user = req.user

    const {type,reason,startDate,endDate} = req.body

    const leave = await LeaveModel.create({type,reason,startDate,endDate,user: user.id,userName: user.userName})

    if(!leave)
    {
        return next(new ErrorHandler("Error in adding Leave Request",400))
    }

    res.status(201).json({
        success: true,
    
    })
})

// exports.getAnnouncement = CatchAsyncError(async(req,res,next)=>{

//     const announcements = await AnnouncementModel.find()

//     if(!announcements)
//     {
//         return next(new ErrorHandler("No Announcements yet available",400))
//     }

//     res.status(200).json({
//         success: true,
//         announcements
//     })
// })

exports.getUserLeaveHistory = CatchAsyncError(async(req,res,next)=>{

    const user = req.user

    const leaves = await LeaveModel.find({user: user.id,$or:[{status: 'Approved'},{status:'Declined'}]})

    if(!leaves)
    {
        return next(new ErrorHandler("No Data Available",400))
    }

    res.status(200).json({
        success: true,
        leaves
    })
})

exports.dashboard = CatchAsyncError(async(req,res,next)=>{

    const user = req.user
    const today = new Date()

    const firstdate = new Date(today.getFullYear(),today.getMonth(), 1, 0, 0, 0)
    const lastDate = new Date(today.getFullYear(),today.getMonth()+1, 0, 23, 59, 59, 999)

    const attendence = (await AttendenceModel.find({status:'Present',date:{$gte: firstdate,$lte: today},user: user.id})).length

    const tasksComplete = (await SpreadsheetModel.find({user: user.id,date:{$gte: firstdate,$lte: lastDate},status:'completed'})).length
    const tasksIncomplete = (await SpreadsheetModel.find({user: user.id,date:{$gte: firstdate,$lte: lastDate},status:'incomplete'})).length
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
   
    const attendances = await AttendenceModel.aggregate([
        {
            $match:{
                status:'Present',
                user: user._id
            }
        },
        {
            $facet:{
                first:[
                    {
                           $match:{
                              
                                loginTime:{$gte : threeMonthsAgo, $lte:new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth() + 1, 0) }
                            }
                        },
                        {
                            $count: "count"
                        },
                        {
                            $addFields:{
                               "month": moment(threeMonthsAgo).format('MMMM')
                            }
                    }
                ],
                second:[
                    {
                           $match:{
                              
                                loginTime:{$gte : firstdate, $lte: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth() + 1, 0)}
                            }
                        },
                        {
                            $count: "count"
                        },
                        {
                            $addFields:{
                                "month": moment(twoMonthsAgo).format('MMMM')
                            }
                    }
                ],
                third:[
                    {
                           $match:{
                              
                                loginTime:{$gte : firstdate, $lte: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() + 1, 0)}
                            }
                        },
                        {
                            $count: "count"
                        },
                        {
                            $addFields:{
                                "month": moment(oneMonthAgo).format('MMMM')
                            }
                    }
                ]
            }
        }
    ])
const firs = attendances[0]?.first[0]?.month  ?? moment(threeMonthsAgo).format('MMMM')

const second = attendances[0]?.second[0]?.month ?? moment(twoMonthsAgo).format('MMMM')
const three = attendances[0]?.third[0]?.month  ?? moment(oneMonthAgo).format('MMMM')
const four = moment(today).format('MMMM')

const threemonths ={
    [firs]: attendances[0]?.first[0]?.count ?? 0,
    [second]: attendances[0]?.first[0]?.count ?? 0,
    [three]: attendances[0]?.first[0]?.count ?? 0,
    [four]: attendence
}   


    res.json({
        success: true,
        attendence,
        tasksComplete,
        tasksIncomplete,
        threemonths
    })
})

exports.updateProfile = CatchAsyncError(async(req,res,next)=>{

    const user = req.user

    if(req.file)
    {
        console.log("file")
    const imagePath = req.file.path
    const cloud = await cloudinary.uploader.upload(imagePath,{folder: 'profile'})
    req.body.image = cloud.url
    fs.remove(imagePath)
    }
    else{
        console.log("No file")
    }

  
    const update = await userModel.findByIdAndUpdate(user.id,req.body,{new: true})
    

    if(!update)
    {
        return next(new ErrorHandler("Error in updating",400))
        
    }
  
    res.status(200).json({
        success: true
    })
})


async function handleAttendence(user,res)
{
    
    const today = new Date()
 
    const last = await AttendenceModel.findOne({user: user.id}).sort({_id: -1})
    if(last)
    {
    const diff =Math.abs(moment(last.date).diff(new Date(today.getFullYear(),today.getMonth(),today.getDate()),'days')) 
    let da = last.date
   let prev = new Date(today)
      prev.setDate(today.getDate()-1)
  
    
const Holidays = await HolidayModel.find()
let attendence=[]
    if(diff > 1)
    {
        while(! moment(da).isSame(prev,'day'))
        {

            da.setDate(da.getDate()+1)
          
            if(da.getDay()=== 0 || Holidays.some((dr)=>moment(dr.date).isSame(da,'day') ))
            {
                
            }
            else
            { 
          attendence.push({date: new Date(da), status: "Absent",user: user.id})  
            }
          
        }
        console.log(attendence)
    }
    if(attendence.length > 0)
    {
        const insert = await AttendenceModel.insertMany(attendence)
    }
}

    const alreadyLoggedIn = await AttendenceModel.findOne({date:new Date(today.getFullYear(),today.getMonth(),today.getDate()) ,user: user.id})
    
    if(!alreadyLoggedIn)
    {
    const attendence = await AttendenceModel.create({
        date: new Date(today.getFullYear(),today.getMonth(),today.getDate()),
        loginTime: Date.now(),
        user: user.id
    }) 
}

SendToken(user,res,200)
}