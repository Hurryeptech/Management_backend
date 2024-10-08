const CatchAsyncError = require("../middlewares/CatchAsyncError")
const AdminModel = require("../models/AdminModel")
const ErrorHandler = require("../utils/ErrorHandler")
const otplib = require("otplib")
const SendToken = require("../utils/SendToken")
const UserModel = require("../models/UserModel")
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

exports.RegisterAdmin = CatchAsyncError(async(req,res,next)=>{

    const admin = await AdminModel.create(req.body)

    if(!admin)
    {
        return next(new ErrorHandler("Some error in creaing admin",400))
    }

    res.status(201).json({
        success: true,
        admin
    })
})

exports.LoginAdmin = CatchAsyncError(async(req,res,next)=>{

    const {adminEmail} =req.body

    const admin = await AdminModel.findOne({adminEmail: adminEmail})

    if(!admin)
    {
        return next(new ErrorHandler("Not an Valid admin user",400))
    }

    otplib.totp.options = {digits: 4,step: 120}
    const otp = otplib.totp.generate(process.env.OTPLIB_SECRET)

    const options = {
        to: "msdsuren07@gmail.com",
        html: `<p> Verify Your Otp ${otp}`
}
// const mail = sendMail(options)

// if(!mail)
// {
//     return next(new ErrorHandler("Problem in Sending Mail",500))
// }

res.status(200).json({
    success: true,
    message: "Logged in",
    otp
})
})

exports.VerifyOtp = CatchAsyncError(async(req,res,next)=>{

    const {adminEmail,otp} = req.body

    const verify = otplib.totp.check(otp,process.env.OTPLIB_SECRET)

    if(!verify)
    {
        return next(new ErrorHandler("Otp is Wrong",401))
    }
    
    const user = await AdminModel.findOne({adminEmail: adminEmail})

    if(!user)
        {
            return next(new ErrorHandler("Not a Valid User",401))
        }

    SendToken(user,res,200)
})

exports.GetUsersEmail = CatchAsyncError(async(req,res)=>{


    const userfilter= new Apifeatures(UserModel.find({},{userEmail: 1,_id:0,userName: 1}),req.query).search()
    const users = await userfilter.query
    // const users = await UserModel.find()

    if(!users)
    {
        return next(new ErrorHandler("Error in finding Users ",400))
    }
 

    res.status(200).json({
        success: true,
        users
    })
})

exports.getAllUsers = CatchAsyncError(async(req,res,next)=>{

   const  users = await UserModel.find()

   if(!users)
   {
    return next(new ErrorHandler("No Users Found",400))
   }

   res.status(200).json({
    users
   })
})

exports.deleteUser = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.params

    console.log(id)
    const user = await UserModel.findByIdAndDelete(id)
    const team = await TeamModel.findOneAndDelete({users: id})
    const tasks = await TaskModel.findOneAndDelete({user: id})
    if(!user)
    {
        return next(new ErrorHandler("Error in Deleting the User",400))
    }

    res.json({
        success: true,
        message: "User Deleted Successfully"
    })
})



exports.getUserDetails = CatchAsyncError(async(req,res,next)=>{
console.log(req.params)
    const {id} = req.params
    const today = new Date() 
    const user = await UserModel.findOne({userEmail: userEmail})

    const {_id} = user
    const firstdate = new Date(today.getFullYear(),today.getMonth(),1)
    const lastDate = new Date(today.getFullYear(),today.getMonth()+1,0)


    const an = await AttendenceModel.aggregate([
        {
            
          $match:  {
            user: _id,
            date: {
                '$gte': firstdate,
                '$lte': lastDate
            }
        },
       
    },
    {
        $facet:{
            total:[
                {
                    $count: "analysis"
                }
            ],
        late:[
            {
                $match:{
                    late: 1
                }
            },
            {
                $count:"count"
            }
        ],
        half:[
            {
                $match:{
                    halfDay: 1
                }
            },
            {
                $count: "count"
            }
        ]
    }
}


    ])

    const analysis = an[0]?.total[0]?.analysis ?? 0
    const late = an[0]?.late[0]?.count  ?? 0
    const half = an[0]?.half[0]?.count ?? 0

    const holidays =  await HolidayModel.find({},{date: 1})

    const filter = holidays.filter( (dat)=>{
      return  dat.date.getMonth() === today.getMonth()
    })


    if(analysis === 0)
    {
        return next(new ErrorHandler("No attendence for this month is present",400))
    }
    let date = firstdate
    let count=0
    while( date.getDate() !== today.getDate())
    {
        if(date.getDay() === 0 )
        {
            count++;
        }

        date.setDate(date.getDate()+1)
    }

    const daysInMonth = today.getDate()

    const present = Math.abs(analysis - late - half)  
    const absent = Math.abs( daysInMonth - analysis - count - filter.length)

    
    // if(today.getDate() === firstdate.getDate())
    // {
    //     user.paidLeave +=1
    //     user.sickLeave+=1

    //     await user.save()
    // }
    // const paidLeave = user.paidLeave
    // const sickLeave = user.sickLeave

 
    
    res.status(200).json({
        success : true,
        present: present,
        absent: absent,
        halfDay: half,
        late: late
    })
})


exports.addUser = CatchAsyncError(async(req,res)=>{

    const {userName,userEmail,dob,position,mobile,department,address} = req.body

   

    const imagePath = req.file.path

    const cloud = await cloudinary.uploader.upload(imagePath,{folder: 'profile'})
    const user = await UserModel.create({
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

exports.getLeaveNewRequests = CatchAsyncError(async(req,res,next)=>{
    
    const leaves =await  LeaveModel.find({status:'progress'})

    if(!leaves)
    {
        return next(new ErrorHandler("No New Leaves Found",200))
    }

    res.status(200).json({
        leaves
    })

})

exports.giveLeaveStatus = CatchAsyncError(async(req,res,next)=>{

 
    const {id} = req.params
    const {status,rejectReason} = req.body

    const leave = await LeaveModel.findByIdAndUpdate(id,req.body,{new: true})

    let addattendence = moment(leave.endDate).diff(leave.startDate,'days')
    
    if(addattendence > 0)
    {
        
    }

    console.log(addattendence)
    // if(!leave)
    // {
    //     return next(new ErrorHandler("Error in updating Leave",400))
    // }


    const user = await UserModel.findById(leave.user)

    // if(!user)
    // {
    //     return next(new ErrorHandler("No User Found",400))
    // }
let leaveType =""
    if(leave.status === 'Approved')
    {
        if(user.paidLeave > 0)
            {
               leaveType ="Paid Leave"
            }

        else if(user.sickLeave > 0)
            {
                leaveType = "Sick Leave"
            }
            else
            {
               
                leaveType = "Absent"
            }
    }
    let attendances= []
   let sDate = moment(leave.startDate).toDate()
    while(addattendence >= 0)
    {
        attendances.push({date: new Date(sDate.getFullYear(),sDate.getMonth(),sDate.getDate()),user: user.id,status: leaveType})
     sDate.setDate(sDate.getDate()+1)
        addattendence--
    }
    console.log(attendances)
    await user.save()

    const attendances2 = await AttendenceModel.insertMany(attendances)
    const mailOptions = {
                to: user.userEmail,
                html: leave.status === 'Approved'? `<p> Your Leave Request is Approved`: `<p> Your Leave Request is Rejected.Reason: ${leave.rejectReason}</p>`,
                subject: "Leave Status"
    }

    const mail = await sendMail(mailOptions)
    if(!mail)
    {
        return next(new ErrorHandler("Error in Sending mail",400))
    }
    res.status(200).json({
        success: true
    })
})

exports.getLeaveHistory = CatchAsyncError(async(req,res)=>{

    const leaves = await LeaveModel.find({$or:[{status:'Approved'},{status:'Declined'}]})

    if(!leaves)
    {
        return next(new ErrorHandler("No Leave History is Available",400))
    }

    res.status(200).json({
        success: true,
        leaves
    })
})

exports.userProfile = CatchAsyncError(async(req,res)=>{

    const {id} = req.params


    const user  = await UserModel.findById(id)
    console.log(user)
    if(!user)
    {
        return next(new ErrorHandler("No user Found",401))
    }
    res.json({
        success: true,
        user
    })
})

exports.adminDashboard = CatchAsyncError(async(req,res)=>{


    const today = new Date()

    const firstdate = new Date(today.getFullYear(),today.getMonth(), 1, 0, 0, 0)
    const lastDate = new Date(today.getFullYear(),today.getMonth()+1, 0, 23, 59, 59, 999)
const todayDate = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    const users = (await UserModel.find()).length

    const attendence = (await AttendenceModel.find({date:todayDate})).length
    const absentTotal = Math.abs(users - attendence)
    const tasksComplete = (await SpreadsheetModel.find({date:{$gte: firstdate,$lte: lastDate},status:'completed'})).length
    const tasksIncomplete = (await SpreadsheetModel.find({date:{$gte: firstdate,$lte: lastDate},status:'incomplete'})).length
    

    
   
    res.json({
        success: true,
        attendence,
        absentTotal,
        tasksComplete,
        tasksIncomplete,
        users
    })
})
