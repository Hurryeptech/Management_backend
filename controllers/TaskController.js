
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const TaskModel = require("../models/TaskModel")
const TeamModel = require("../models/TeamModel")
const ErrorHandler = require("../utils/ErrorHandler")
const UserModel = require("../models/UserModel")
const SpreadsheetModel = require("../models/SpreadsheetModel")
const moment = require("moment")

// exports.addTask = CatchAsyncError(async(req,res,next)=>{


//     const {internName, assignee,dueDate,task,status,description} = req.body

//     const {id} = req.params

//     console.log(id)
             
//     const team = await TeamModel.findById(id)
//     if(!team)
//     {
//         return next(new ErrorHandler("First Create Team",401))
//     }
//     const newTask = await TaskModel.create({
//         internName: internName,
//         assignee: assignee,
//         dueDate: dueDate,
//         task: task,
//         status: status,
//         description: description,
//     })
    
// console.log(id)
   
//     newTask.teams.push(id)
//     console.log(newTask)
//     team.tasks.push(newTask.id)
    
 
//     await team.save()
//     await newTask.save()

//     res.status(200).json({
//         success: true,
//         message: "Task Added",
//         newTask
//     })
// })

exports.getAllTasks = CatchAsyncError(async(req,res)=>{

    const {userEmail} = req.body
    const user = await UserModel.findOne(userEmail)
    const allTasks = await TaskModel.find({user: user.id})

    res.json({
        success: true,
        allTasks
    })
})

exports.updateTasks = CatchAsyncError(async(req,res,next)=>{


    const id = req.params.taskId
  
    const updatedTask  = await TaskModel.findByIdAndUpdate(id,req.body,{new:true,runValidators: false})

    if(!updatedTask)
        {
            return next(new ErrorHandler("No tasks is Found",400))
        }

     
    res.json({
        success: true,
        updatedTask
    })
})

// exports.deleteTask = CatchAsyncError(async(req,res,next)=>{
//     const {id} = req.params
//     const deleteTask = await TaskModel.findByIdAndDelete(id)

//     if(!deleteTask)
//     {
//         return next(new ErrorHandler("some error while deleting",500))
//     }

//     res.status(200).json({
//         success: true,
//         message:"Task Deleted Successfully"
//     })
// })

exports.memberTaskUpdate = CatchAsyncError(async(req,res,next)=>{


    const taskId = req.params.id
    const {id} = req.user
    const {employeeStatus} = req.body


    const updatedTask  = await TaskModel.findByIdAndUpdate(taskId,{employeeStatus: employeeStatus},{new:true,runValidators: false})



    const spreadsheet = await SpreadsheetModel.create({
        date: moment(updatedTask.date).format("YYYY-MM-DD"),
        assignee: updatedTask.assignee, 
        task: updatedTask.task,
        details: updatedTask.details, 
        status: updatedTask.employeeStatus,
        user: id,
        client: updatedTask.client
    })


    if(!spreadsheet)
    {
        return next(new ErrorHandler("Error in Creating in Spreadsheet",400))
    }

    res.status(201).json({
        success: true,
        message:"Spreadsheet Created",
        updatedTask
    })


})
