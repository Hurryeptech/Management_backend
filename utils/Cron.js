const cron = require("node-cron")
const UserModel = require("../models/UserModel")
const SetupModel = require("../models/SetupModel")
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const LeaveModel = require("../models/LeaveModel")

 exports.cronJob = cron.schedule('0 39 17 * * *',CatchAsyncError(async()=>{

  console.log("Inside")
  // const setup = await SetupModel.findOne({},{"staffs.leaveTypes":1})
  //     let maps={}
  //     let maps2={}
  //     let op=[]
  //      const se=setup.staffs.leaveTypes.forEach((sd)=>{
  //       if(!(sd.carryForward === 'Yes'))
  //       {
  //        maps[sd.leaveType] = sd.numberOfDays
  //       }
  //       else
  //       {
  //         maps2[sd.leaveType]= sd.numberOfDays
  //       }
  //     })
      
     
       
  //       const users = await LeaveModel.find({})
  //       if(Object.keys(maps).length > 0)
  //       {
  //       users.forEach((user)=>{
  //         let updates={}
  //         for(const [leaveType,days] of Object.entries(maps))
  //         {
  //           if(!user.leaveBalances.hasOwnProperty(leaveType))
  //           {
  //              updates[`leaveBalances.${leaveType}`]= days
  //             user.leaveBalances[leaveType] = days
  //           }
  //           else
  //           {
  //             updates[`leaveBalances.${leaveType}`]=user.leaveBalances[leaveType] + days
              
  //            }
  //         } 
  //         if(Object.keys(updates).length > 0)
  //           {
              
  //             op.push({
  //               updateOne:{
  //                 filter:{userId: user.userId},
  //                 update :{$set: updates}
  //               }
  //             })
  //           }       
  //       })
  //     }

        

  //       if(Object.keys(maps2).length >0)
  //       {
  //         users.forEach((user)=>{
  //           let updates2={}
  //           for(const [leaveType,days] of Object.entries(maps2))
  //           {
  //             if(!user.leaveBalances.hasOwnProperty(leaveType))
  //             {
  //                updates2[`leaveBalances.${leaveType}`]= days
  //               user.leaveBalances[leaveType] = days
  //             }
  //             else
  //             {
  //               updates2[`leaveBalances.${leaveType}`]=user.leaveBalances[leaveType] + days
                
  //              }
  //           } 
  //           if(Object.keys(updates2).length > 0)
  //             {
                
  //               op.push({
  //                 updateOne:{
  //                   filter:{userId: user.userId},
  //                   update :{$set: updates2}
  //                 }
  //               })
  //             }       
  //         })
  //       }

  //       if(op.length >0)
  //         {
  //           await LeaveModel.bulkWrite(op)
  //         }
   
}))

// exports.cronJob2 = cron.schedule('1 1 0 1 6 *',CatchAsyncError(async ()=>{


//     const user = await UserModel.updateMany({},{

//         paidLeave: 0,sickLeave: 0
//     })
// }))


