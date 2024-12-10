const setupModel = require("../models/SetupModel")
const CatchAsyncError = require("../middlewares/CatchAsyncError")

exports.addSetup = CatchAsyncError(async(req,res)=>{

 
    const {data} = req.body
    const category = Object.keys(data)[0]

    const subCategory = Object.keys(data[category])[0]
    const val = data[category][subCategory]
    const setup = await setupModel.find()
    if(setup.length > 0)
    {
        
        const update = await setupModel.findOneAndUpdate({},{$push:{[`${category}.${subCategory}`] : val}},{new: true})
      
        // setup[0][category][subCategory].push({val})
        // setup[0].save()
        // console.log(setup[0][category][subCategory])
    }
    else
    {
        
        const set = await setupModel.create(req.body)
       const s= set[category][subCategory]
       set[category][subCategory].push(val)
     
       
       set.save()
   
       
        
    }

    res.status(200).json({
        success: true
    })
})

exports.updateSetup = CatchAsyncError(async(req,res)=>{

    const {data} = req.body
 
    const category = Object.keys(data)[0]
  
    const subCategory = Object.keys(data[category])[0]
    const val = data[category][subCategory][0]
    const oldValue = data['oldValue']
   
    // const setup = await setupModel.find()
    const setup = await setupModel.findOne({[`${category}.${subCategory}`]: oldValue})
  
    setup[category][subCategory].pull(oldValue)
    setup[category][subCategory].push(val)
    setup.save()


    res.status(200).json({
        success: true
    })
})

exports.deleteSetup = CatchAsyncError(async(req,res)=>{

   
    const {data} = req.body
    const category = Object.keys(data)[0]
  
    const subCategory = Object.keys(data[category])[0]

    const val = data[category][subCategory][0]

    const setup = await setupModel.updateOne({},{$pull:{[`${category}.${subCategory}`]: val}})
    // setup[0][category][subCategory].remove(val)
    // setup[0].save()
  
    res.status(204).json({
        success: true
    })
})

exports.getSetups = CatchAsyncError(async(req,res)=>{
  
   const{category,subCategory} = req.params

 
    // const category = Object.keys(data)[0]
    // const subCategory = Object.keys(data[category])[0]
    // const val = data[category][subCategory][0]

    const setup = await setupModel.find({},{[`${category}.${subCategory}`]: 1})

    res.status(200).json({
        success: true,
        setup
    })
})