const cron = require("node-cron")
const UserModel = require("../models/UserModel")
const CatchAsyncError = require("../middlewares/CatchAsyncError")

 exports.cronJob = cron.schedule('1 26 12 25 9 *',CatchAsyncError(async()=>{

    // const users = await UserModel.find()

    // users.forEach((user)=>{
    //     user.paidLeave= user.paidLeave + 1 
    //     user.sickLeave= user.sickLeave + 1
    //     user.save()
    //     console.log(user)
    // })

    const users = await UserModel.updateMany({},{
        $inc:{
            paidLeave: 1,
            sickLeave: 1
        }
    })
    
   
}))

exports.cronJob2 = cron.schedule('1 1 0 1 6 *',CatchAsyncError(async ()=>{


    const user = await UserModel.updateMany({},{

        paidLeave: 0,sickLeave: 0
    })
}))


