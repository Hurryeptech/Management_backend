const CatchAsyncError = require("../middlewares/CatchAsyncError")
const ErrorHandler = require("../utils/ErrorHandler")
const HolidayModel = require("../models/HolidayModel");



exports.addHolidays = CatchAsyncError(async(req,res)=>{

    const {date,reason} = req.body

    const holiday = await HolidayModel.create({
        date: date,
        reason: reason
    })

    if(!holiday)
    {
        return next(new ErrorHandler("Error In Creating Holidays",500))
    }

    res.status(201).json({
        success: true,
        holiday
    })
})

exports.getHolidays = CatchAsyncError(async(req,res)=>{

    const holidays = await HolidayModel.find()

    if(!holidays)
    {
        return next(new ErrorHandler("No Holidays are reported",500))
    }

    res.status(200).json({
        success: true,
        holidays
    })
})

exports.updateHoliday = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.query

    const holiday = await HolidayModel.findByIdAndUpdate(id,req.body,{ new: true })

    if(!holiday)
    {
        return next(new ErrorHandler("Error in updating holidays",500))
    }

    res.status(200).json({
        success: true,
        holiday
    })
})

exports.deleteHoliday = CatchAsyncError(async(req,res,next)=>{

    const {id} = req.params
    console.log(id)

    const holiday = await HolidayModel.findByIdAndDelete(id)

    if(!holiday)
    {
        return next(new ErrorHandler("Error in deleting Holidays",500))
    }

    res.json({
        success: true,
        holiday
    })
})