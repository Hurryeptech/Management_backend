const CatchAsyncError = require("../middlewares/CatchAsyncError")
const projectModel = require("../models/ProjectModel")
const taskModel = require("../models/TaskModel")
const ErrorHandler = require("../utils/ErrorHandler")
const mongodb = require("mongodb")
const {ObjectId}= mongodb

exports.createProject = CatchAsyncError(async(req,res,next)=>{
   console.log(req.body)
    if(!req.body.members.find((mem)=>mem._id === req.user.id))
    {
  
     req.body.members.push({_id: req.user.id,memberName: req.user.firstName})
    }

    const project = await projectModel.create(req.body)

    if(!project)
    {
        return next(new ErrorHandler("Error in creating project",500))
    }
    res.status(201).json({
        success: true
    })
})

exports.getProjects = CatchAsyncError(async(req,res,next)=>{

    // console.log(req.params)
    if(req.params.projectId)
    {
        const { projectId } = req.params

        const project = await projectModel.findById(projectId)

    if(!project)
    {
        return next(new ErrorHandler("No project Found",204))
    }
    
    return res.status(200).json({
        success: true,
        project
    })
    }

    if(req.user.administrator)
    {
        const projects = await projectModel.find()
        return res.status(200).json({
            success: true,
            projects
        })
    }
    const projects = await projectModel.find({members:{$elemMatch:{_id: req.user.id}}})
 
    if(projects.length < 0)
    {
        return next(new ErrorHandler("No Project  Found",204))
    }
    res.status(200).json({
        success: true,
        projects
    })
})

exports.updateProject = CatchAsyncError(async(req,res)=>{

    const {projectId}= req.params
 console.log("update",projectId)
    const project = await projectModel.findByIdAndUpdate(projectId,req.body)

    res.status(201).json({
        success: true,
        project
    })
})


exports.getNameProjects = CatchAsyncError(async(req,res)=>{

    const project = await projectModel.find({},{projectName:1,_id: 1})
    
    res.json({
        success: true,
        project
    })
})


exports.getProjectTasks = CatchAsyncError(async(req,res)=>{

    const id  = req.params.id
    const tasks = await taskModel.find({"project._id": id})
    res.status(200).json({
        success: true,
        tasks
    })
})
exports.tasksDashboard = CatchAsyncError(async(req,res)=>{

    const id =req.params.id
   
    const task = await taskModel.aggregate([
        {
            $match: {
                "project._id": new ObjectId(id)
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

exports.projectDashboard = CatchAsyncError(async(req,res)=>{
  
    const aggregation=[
        {
            $group: {
                _id: null,        
                notStarted:{
                    $sum:{$cond:[{$eq:['$status','Not Started']},1,0]}
                } ,
                onHold:{
                    $sum:{$cond:[{$eq:['$status','On Hold']},1,0]}
                }     ,
                cancelled:{
                    $sum:{$cond:[{$eq:['$status','Cancelled']},1,0]}
                }     ,
                completed:{
                    $sum:{$cond:[{$eq:['$status','Completed']},1,0]}
                }   ,
                inprogress:{
                    $sum:{$cond:[{$eq:['$status','In Progress']},1,0]}
                }        
            }
        }
    ]
    if(!req.user.administrator)
    {
        console.log("yes")
        aggregation.unshift(  {
            $match: {
               $or:[
                   {
                      "members":{$elemMatch:{_id: new ObjectId(req.user.id)}}
                   }
               ]
            }
        })
    }
    const project = await projectModel.aggregate(aggregation);

    res.status(200).json({
        success: true,
        project
    })

})