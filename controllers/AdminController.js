const CatchAsyncError = require("../middlewares/CatchAsyncError")
const AdminModel = require("../models/AdminModel")
const ErrorHandler = require("../utils/ErrorHandler")
const otplib = require("otplib")
const SendToken = require("../utils/SendToken")
const userModel = require("../models/UserModel")
const {isEmail} = require("validator")
const Apifeatures = require("../utils/Apifeatures")
const HolidayModel = require("../models/HolidayModel");
const AttendenceModel = require("../models/AttendenceModel")
const TeamModel = require("../models/TeamModel")
const SpreadsheetModel = require("../models/SpreadsheetModel")
const moment =require("moment")
const fs = require("fs-extra")
const cloudinary = require("../utils/Cloudinary")
const LeaveModel = require("../models/LeaveModel")
const sendMail = require("../utils/SendEmail")
const TaskModel = require("../models/TaskModel")
const path = require("path")
const customerModel = require("../models/CustomerModel")
// exports.RegisterAdmin = CatchAsyncError(async(req,res,next)=>{

//     const admin = await AdminModel.create(req.body)

//     if(!admin)
//     {
//         return next(new ErrorHandler("Some error in creaing admin",400))
//     }

//     res.status(201).json({
//         success: true,
//         admin
//     })
// })

// exports.LoginAdmin = CatchAsyncError(async(req,res,next)=>{

//     const {adminEmail} =req.body

//     const admin = await AdminModel.findOne({adminEmail: adminEmail})

//     if(!admin)
//     {
//         return next(new ErrorHandler("Not an Valid admin user",400))
//     }

//     otplib.totp.options = {digits: 4,step: 120}
//     const otp = otplib.totp.generate(process.env.OTPLIB_SECRET)

//     const options = {
//         to: "msdsuren07@gmail.com",
//         html: `<p> Verify Your Otp ${otp}`
// }
// // const mail = sendMail(options)

// // if(!mail)
// // {
// //     return next(new ErrorHandler("Problem in Sending Mail",500))
// // }

// res.status(200).json({
//     success: true,
//     message: "Logged in",
//     otp
// })
// })

// exports.VerifyOtp = CatchAsyncError(async(req,res,next)=>{

//     const {adminEmail,otp} = req.body

//     const verify = otplib.totp.check(otp,process.env.OTPLIB_SECRET)

//     if(!verify)
//     {
//         return next(new ErrorHandler("Otp is Wrong",401))
//     }
    
//     const user = await AdminModel.findOne({adminEmail: adminEmail})

//     if(!user)
//         {
//             return next(new ErrorHandler("Not a Valid User",401))
//         }

//     SendToken(user,res,200)
// })


exports.getAllUsers = CatchAsyncError(async(req,res,next)=>{
 

   const  users = await userModel.find()

   if(!users)
   {
    return next(new ErrorHandler("No Users Found",400))
   }

   res.status(200).json({
    users
   })
})





exports.addUser = CatchAsyncError(async(req,res,next)=>{

   const email = isEmail(req.body.userEmail)
   if(!email)
   {
    return next(new ErrorHandler("please Enter Valid Email"))
   }
    if(!req.body)
        {
            return next(new ErrorHandler("request is empty",400))
        }
const noOfUser = await userModel.collection.countDocuments()+1
        req.body.empId = 'HT'+noOfUser
        let imagePath;
        if(req.file)
        {
        imagePath = req.file.path
        const cloud = await cloudinary.uploader.upload(imagePath,{folder: 'profile'})
        req.body.image = cloud.url
        fs.remove(imagePath, err => {
            if (err) return console.error(err)
          
          })
      
        }
    
        const user = await userModel.create(req.body)
        
        if(!user)
        {
            return next(new ErrorHandler("Problem in Creating User",500))
        }
     
    
        // if(user.welcomeEmail)
        // {
        //     console.log("inside")
        //     const options={
        //         to:`${user.userEmail}`,
        //         subject:'Welcome Email',
        //         html:`<p>Welcome ${user.firstName + user.lastName} to the Hurryep Crm.Enjoy our platform and services.`
        //     }
        //     sendMail(options)
        // }
   
    
        res.status(201).json({
            success: true,
            message: "User Created",
            // user
        })

})

// exports.getLeaveNewRequests = CatchAsyncError(async(req,res,next)=>{
    
//     const leaves =await  LeaveModel.find({status:'progress'})

//     if(!leaves)
//     {
//         return next(new ErrorHandler("No New Leaves Found",200))
//     }

//     res.status(200).json({
//         leaves
//     })

// })

// exports.giveLeaveStatus = CatchAsyncError(async(req,res,next)=>{

 
//     const {id} = req.params
//     const {status,rejectReason} = req.body

//     const leave = await LeaveModel.findByIdAndUpdate(id,req.body,{new: true})

//     let addattendence = moment(leave.endDate).diff(leave.startDate,'days')
    
//     if(addattendence > 0)
//     {
        
//     }

//     console.log(addattendence)
//     // if(!leave)
//     // {
//     //     return next(new ErrorHandler("Error in updating Leave",400))
//     // }


//     const user = await UserModel.findById(leave.user)

//     // if(!user)
//     // {
//     //     return next(new ErrorHandler("No User Found",400))
//     // }
// let leaveType =""
//     if(leave.status === 'Approved')
//     {
//         if(user.paidLeave > 0)
//             {
//                leaveType ="Paid Leave"
//             }

//         else if(user.sickLeave > 0)
//             {
//                 leaveType = "Sick Leave"
//             }
//             else
//             {
               
//                 leaveType = "Absent"
//             }
//     }
//     let attendances= []
//    let sDate = moment(leave.startDate).toDate()
//     while(addattendence >= 0)
//     {
//         attendances.push({date: new Date(sDate.getFullYear(),sDate.getMonth(),sDate.getDate()),user: user.id,status: leaveType})
//      sDate.setDate(sDate.getDate()+1)
//         addattendence--
//     }
//     console.log(attendances)
//     await user.save()

//     const attendances2 = await AttendenceModel.insertMany(attendances)
//     const mailOptions = {
//                 to: user.userEmail,
//                 html: leave.status === 'Approved'? `<p> Your Leave Request is Approved`: `<p> Your Leave Request is Rejected.Reason: ${leave.rejectReason}</p>`,
//                 subject: "Leave Status"
//     }

//     const mail = await sendMail(mailOptions)
//     if(!mail)
//     {
//         return next(new ErrorHandler("Error in Sending mail",400))
//     }
//     res.status(200).json({
//         success: true
//     })
// })

// exports.getLeaveHistory = CatchAsyncError(async(req,res,next)=>{

//     const leaves = await LeaveModel.find({$or:[{status:'Approved'},{status:'Declined'}]})

//     if(!leaves)
//     {
//         return next(new ErrorHandler("No Leave History is Available",400))
//     }

//     res.status(200).json({
//         success: true,
//         leaves
//     })
// })

exports.userProfile = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.params


    const user  = await userModel.findById(id)
   
    if(!user)
    {
        return next(new ErrorHandler("No user Found",401))
    }
    res.json({
        success: true,
        user
    })
})

// exports.createCustomer = CatchAsyncError(async(req,res,next)=>{

//     if(!req.body)
//     {
//         return next(new ErrorHandler("request is empty",400))
//     }

//     const customer = await customerModel.create(req.body)

//     res.status(201).json({
//         success: true,
//         customer
//     })
// })
