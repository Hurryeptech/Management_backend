const mongoose= require("mongoose")
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const TaskModel = require("../models/TaskModel")
const TeamModel = require("../models/TeamModel")
const UserModel = require("../models/UserModel")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createTeam = CatchAsyncError(async(req,res,next)=>{

    const {teamName} = req.body
    const {userEmail} = req.user

    const user = await UserModel.findOne({userEmail: userEmail})
    const newTeam = await TeamModel.create({
        teamName: teamName,
        users: user.id
    })
    user.team.push(newTeam.id)
    await user.save()
    
    
    res.status(201).json({
        success : true,
        message: "Team Created",
        newTeam
    })
})

exports.addMembers = CatchAsyncError(async(req,res,next)=>{

    const {members} = req.body
    const {id} = req.params
    const team = await TeamModel.findById(id)
    const user = await UserModel.findOne({userEmail: members})
    const admin = team.users.includes(user.id)
    if(admin)
    {
        return next(new ErrorHandler("Admin Cannot be a member",400))
    }
    const alreadymember = team.members.includes(user.id)
 

    if(alreadymember)
    {
        return next(new ErrorHandler("already member",400))
    }
  
   
   team.members.push(user.id)
 
   const task = await TaskModel.create({internName: user.userName, user: user.id })
    task.teams.push(team.id)
   team.tasks.push(task.id)
    await task.save()
   await team.save()

    res.status(201).json({
        success: true,
        message: "Members Added Successfully"
    })


})


exports.deleteMembers = CatchAsyncError(async(req,res,next)=>{

    const userEmail = req.params.userEmail
    const teamid = req.params.id

    const user = await UserModel.findOne({userEmail: userEmail})

    const team = await TeamModel.findByIdAndUpdate(teamid,{
        $pull:{
            members: user.id
        }
    })

  
    

    res.json({
        success: true
    })
})

exports.getTeams = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.user

    const user = await UserModel.findById(id)

    const team = await TeamModel.find({users: user.id})
    // const members = await UserModel.aggregate([
    //     {
    //         $lookup:{
    //             from: "teams",
    //             localField:"_id",
    //             foreignField:"members",
    //             as:"memberDetails"
    //         }
    //     }
    // ])

const userId = new mongoose.Types.ObjectId(user.id)
const results2 = await TeamModel.aggregate([
    {
        $match:{
            $expr:{
                $in:[
                    userId,"$members"
                ]
            }
        }
    },
    {
        $lookup:{
            from:"tasks",
            localField:"tasks",
            foreignField:"_id",
            as:"members"
        }
    }
])


    // const memberTeams = await TeamModel.find({members: user.id})
    let results =[]
    let memberTasks =[]
    if(team.length > 0)
    {
       
         results = await TeamModel.aggregate([
            {
            $match:{
                $expr:{
                    $in:[
                        userId,"$users"
                    ]
                }
            }
        },
            {
              $lookup: {
                from: 'tasks',        
                localField: 'tasks', 
                foreignField: '_id',      
                as: 'Details'      
              }
            }
          ]);      
    }

    // if(memberTeams.length > 0)
    // {
    //     memberTasks = await TeamModel.aggregate([
    //         {
    //             $lookup:{
    //                 from: "tasks",
    //                 localField: "tasks",
    //                 foreignField: "_id",
    //                 as:"Details_1"
    //             }
    //         }
    //     ])
    // }
 
    res.json({
        success: true,
        results,
        results2,userId
    })

})

// exports.addTasks = CatchAsyncError(async(req,res)=>{

//     const {internName, assignee,dueDate,task,status,description} = req.body

//     const {teamId} = req.query

//     console.log(req.query)

    
// })

exports.getAssignee = CatchAsyncError(async(req,res,next)=>{

    let id =req.params.id
    id= new mongoose.Types.ObjectId(id)
    const names = await TeamModel.aggregate([
        {
            $match:{
                _id: id
            }
        },
        {
           $lookup:{
            from:"users",
            localField:"users",
            foreignField:"_id",
            as:"user"
           }
        },
        {
            $lookup:{
               from: "users",
               localField:"members",
               foreignField:"_id",
               as:"assignee"
            }
        },
        {
            $project:{
               assignees:{
                $concatArrays:[
                    "$user","$assignee"
                ]
               }
            }
        },
     
        
      
    ])
   
    res.status(200).json({
        names
    })
})

exports.deleteTeam = CatchAsyncError(async(req,res,next)=>{

    const {id}  = req.params

    const {userEmail} = req.user
    const team = await TeamModel.findByIdAndDelete(id)
    if(!team)
    {
        return next(new ErrorHandler("No resource Found to deleted",204))
    }

    const task = await TaskModel.deleteMany({teams: team.id})

    const user = await UserModel.updateOne({userEmail},{$pull:{team: team.id}})

    res.status(200).json({
        success: true
    }) 
})
