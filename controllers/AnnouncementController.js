const CatchAsyncError = require("../middlewares/CatchAsyncError");
const AnnouncementModel = require("../models/AnnouncementModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createAnnouncement = CatchAsyncError(async (req, res, next) => {
  const { date, title, description } = req.body;
  const announcement = await AnnouncementModel.create({
    date,
    title,
    description,
  });

  if (!announcement) {
    return next(new ErrorHandler("Error in creating records", 400));
  }

  res.status(201).json({
    success: true,
  });
});

exports.updateAnnouncement = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const announcement = await AnnouncementModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!announcement) {
    return next(new ErrorHandler("Error in updating records", 400));
  }

  res.status(200).json({
    success: true,
  });
});

exports.getAnnouncements = CatchAsyncError(async (req, res) => {
  const user = req.user;
  const userId = user.id;
  const announcement = await AnnouncementModel.find().sort({ _id: -1 });
  // const update = await AnnouncementModel.updateMany({userId:{$nin:[req.user.id]}},{$addToSet:{userId:req.user.id}})
  // const unread = update.matchedCount
  const update = await AnnouncementModel.find({
    userId: { $nin: [req.user.id] },
  });
  res.json({
    success: true,
    notification: {
      announcement: announcement,
      update: update.length,
    },
  });
});

exports.markAsRead = CatchAsyncError(async (req, res) => {
  const user = req.user.id;
  const update = await AnnouncementModel.updateMany(
    { userId: { $nin: [req.user.id] } },
    { $addToSet: { userId: req.user.id } }
  );
  const announcement = await AnnouncementModel.find().sort({ _id: -1 });

  res.status(200).json({
    success: true,
    notification: {
      announcement: announcement,
      update: 0,
    },
  });
});

// exports.updateSeenAnnouncement = CatchAsyncError(async(req,res)=>{

//     const {announcementIds} = req.body

//     const announcement = await AnnouncementModel.updateMany( { _id: { $in: announcementIds } },
//         { $set: { isSeen: true } })

// })
