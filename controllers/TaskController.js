
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const taskModel = require("../models/TaskModel")
const ErrorHandler = require("../utils/ErrorHandler")
const userModel = require("../models/UserModel")
const mongodb = require("mongodb")
const {ObjectId}=mongodb
const fs =require("fs-extra")
const cloudinary = require("../utils/Cloudinary")
exports.createTasks = CatchAsyncError(async(req,res,next)=>{
let fields;
console.log(req.body)
req.body.data = JSON.parse(req.body.data)
    if(req.files.length >0)
    {
        console.log("files")
        const files = req.files;
        let fileIndex = 0;
     
        req.body.data.attachments = files
       
        req.body.data = await upload(req.body.data, files);
     
        
    }
    // if(!req.body.data.assignees.find((mem)=>mem._id === req.user.id))
    //     {
      
    //         // if(!Array.isArray(req.body.assignees))
    //         // {
    //         //     req.body.assignees =[]
    //         // }
    //      req.body.data.assignees.push({_id: req.user.id,assigneesName: req.user.firstName})
    //     }
    const task = await taskModel.create(req.body.data)

    res.status(201).json({
        success: true
    })
})

const uploadImages = async (index, files) => {
    console.log("inside upload", index);
    const result = await cloudinary.uploader.upload(files[index].path, {
      folder: "crm",
      resource_type:'auto'
    });
    fs.remove(files[index].path, (err) => {
      if (err) return console.error(err);
    });
    return result.url;
  };
  const upload = async (response, files) => {
    let fileIndex = 0;    
    console.log(response)
    for (const i in response.attachments) {
      
        console.log("image",response.attachments[i].originalname);
        
        response.attachments[i] = {id:Math.random(),image:await uploadImages(fileIndex, files),name: response.attachments[i].originalname};

        fileIndex++;
        
    }
    return response;
  };
exports.getTasks = CatchAsyncError(async(req,res,next)=>{
    console.log(req.user.id)
    if(req.user.administrator)
    {
        const tasks = await taskModel.find()
       return res.status(200).json({
            success: true,
            tasks
        })
    }
    const tasks = await taskModel.find({$or:[{assignees:{$elemMatch:{_id: req.user.id}}},{followers:{$elemMatch:{_id: req.user.id}}}]})
 
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
    // if(req.params)
    // {

    // }
    let aggregation=[]
    if(req.params.id)
        {
           aggregation.push({
               $match:{
                  "project._id":new ObjectId(req.params.id) 
               }
           })
        }

 aggregation.push({
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
             })
           
    if(!req.user.administrator)
    {
        const id =new ObjectId(user.id)
        aggregation.unshift(   {
                 $match: {
                    $or:[
                        {
                           "assignees":{$elemMatch:{_id: id}}
                        },
                        {
                            "followers":{$elemMatch:{_id: id}}
                        }
                    ]
                 }
             })
    }
    const task = await taskModel.aggregate(aggregation);

    res.status(200).json({
        success: true,
        task
    })
})

exports.getStaffs = CatchAsyncError(async(req,res)=>{

    const staffs = await userModel.find({},{firstName: 1,_id:1,empId:1})
   
    // const names = staffs.map((st)=>st.firstName)
    res.status(200).json({
        success: true,
        staffs
        // names
    })
})

exports.updateTasks = CatchAsyncError(async(req,res)=>{

    const {id} = req.params
    let name="hurryep-3"
    let task;
//  let fields=req.body;
console.log(req.body)
if(req.body.delete)
    { 
        console.log(req.body.delete)
        const tasks = await taskModel.findByIdAndUpdate(id,{$pull:{attachments:{id: JSON.parse(req.body.delete)} }},{new: true})
        return res.status(200).json({
            success: true,
            tasks: tasks.attachments
        })
    }
if(req.files)
    {
        console.log("files")
        const files = req.files;
        let fileIndex = 0;
        // req.body = JSON.parse(req.body)
        req.body.attachments = files
  
        req.body = await upload(req.body, files);
       
        const tasks = await taskModel.findByIdAndUpdate(id,{$push:{attachments: req.body.attachments}},{new: true})
       return res.status(200).json({
            success: true,
            tasks: tasks.attachments
        })
    }
    
   if(req.body.comments)
   {
     task = await taskModel.findOne({"comments._id": id})

    if(task)
    {
        
        let s= task.comments.findIndex((sd)=>
            sd._id.equals(new ObjectId(id))
        )
       
        task.comments[s].comment = req.body.comments.comment
        await task.save()
    }
    else
    {
         task = await taskModel.findByIdAndUpdate(id,{$push:{comments: req.body.comments}},{new: true})
    }
   return res.status(200).json({
        success: true,
        task
    })
   }
    const tasks = await taskModel.findByIdAndUpdate(id,req.body,{new: true})

    res.status(200).json({
        success: true,

    })
})

exports.deleteComment = CatchAsyncError(async(req,res)=>{

    const id = new ObjectId(req.params)
    const task = await taskModel.findOneAndUpdate({"comments._id": id},{$pull:{comments:{_id: id}}},{new: true})
    res.json({
        success:true,
        task
    })
})