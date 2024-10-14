const CatchAsyncError = require("../middlewares/CatchAsyncError")
const AnnouncementModel = require("../models/AnnouncementModel")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createAnnouncement = CatchAsyncError(async(req,res,next)=>{

    const {date,title,description} = req.body
    const announcement = await AnnouncementModel.create({date,title,description})

    if(!announcement)
    {
        return next(new ErrorHandler("Error in creating records",400))
    }

    res.status(201).json({
        success: true
    })
})

exports.updateAnnouncement = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.params

    const  announcement = await AnnouncementModel.findByIdAndUpdate(id,req.body,{new: true})

    if(!announcement)
        {
            return next(new ErrorHandler("Error in updating records",400))
        }

    res.status(200).json({
        success: true
    })
})

exports.getAnnouncements = CatchAsyncError(async(req,res)=>{

    const announcement = await AnnouncementModel.find()
    const update = await AnnouncementModel.updateMany({userId:{$nin:[req.user.id]}},{$addToSet:{userId:req.user.id}})
    

    res.json({
        success: true,
        announcement
    })
})

// exports.updateSeenAnnouncement = CatchAsyncError(async(req,res)=>{

//     const {announcementIds} = req.body

//     const announcement = await AnnouncementModel.updateMany( { _id: { $in: announcementIds } },
//         { $set: { isSeen: true } })

        
// })