const { use } = require("react")
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const taskModel = require("../models/TaskModel")
const ErrorHandler = require("../utils/ErrorHandler")

const userModel = require("../models/UserModel")


exports.createTasks = CatchAsyncError(async(req,res,next)=>{

  
req.body.user = req.user.id


    if(!req.body)
    {
        return next(new ErrorHandler("Request Is Empty",400))
    }

    const task = await taskModel.create(req.body)

    res.status(201).json({
        success: true
    })
})

exports.getTasks = CatchAsyncError(async(req,res,next)=>{

    const tasks = await taskModel.find({user: req.user.id})

    if(tasks.length <= 0)
    {
        return next(new ErrorHandler("No tasks are found",400))
    }
    res.status(200).json({
        success: true,
        tasks
    })
})

exports.getSingleTasks = CatchAsyncError(async(req,res,next)=>{

    const tasksId = req.params.id

    if(!tasksId)
    {
        return next(new ErrorHandler("Params is Empty",400))
    }

    const task = await taskModel.findById(tasksId)

    if(!task)
    {
        return next(new ErrorHandler("task is not found",400))
    }

    res.status(200).json({
        success: true,
        task
    })
})

exports.deleteTasks = CatchAsyncError(async(req,res)=>{

    const taskId= req.params.id

    if(!taskId)
    {
        return next(new ErrorHandler("Params is Empty",400))
    }

    const tasks = await taskModel.findByIdAndDelete(taskId)

    res.status(204).json({
        success: true
    })

})

exports.tasksDashboard = CatchAsyncError(async(req,res)=>{

    const user = req.user
    
    const task = await taskModel.aggregate([
        {
            $match: {
                user: user._id
            }
        },
        {
            $group: {
                _id: null,        
                Completed:{
                    $sum:{$cond:[{$eq:['$status','Completed']},1,0]}
                } ,
                Pending:{
                    $sum:{$cond:[{$eq:['$status','Pending']},1,0]}
                }     ,
                Inprogress:{
                    $sum:{$cond:[{$eq:['$status','Inprogress']},1,0]}
                }     ,
                ReadyToDeliver:{
                    $sum:{$cond:[{$eq:['$status','Ready to Deliver']},1,0]}
                }         ,
                NotStarted:{
                    $sum:{$cond:[{$eq:['$status','Not Started']},1,0]}
                }     ,
                Testing:{
                    $sum:{$cond:[{$eq:['$status','Testing']},1,0]}
                }  
            }
        }
    ]);

    res.status(200).json({
        success: true,
        task
    })
})

exports.getStaffs = CatchAsyncError(async(req,res)=>{

    const staffs = await userModel.find({},{firstName: 1,empId:1,_id:0})
   
    // const names = staffs.map((st)=>st.firstName)
    res.status(200).json({
        success: true,
        staffs
        // names
    })
})

exports.updateTasks = CatchAsyncError(async(req,res)=>{

    const {id} = req.params
     
    const task = await taskModel.findByIdAndUpdate(id,req.body,{new: true})

    console.log(task)

    res.status(200).json({
        success: true,
        task
    })
})