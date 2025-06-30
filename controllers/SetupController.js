const setupModel = require("../models/SetupModel")
const CatchAsyncError = require("../middlewares/CatchAsyncError")
const {ObjectId}=require("mongodb")
exports.addSetup = CatchAsyncError(async(req,res)=>{


    const {data} = req.body
    const category = Object.keys(data)[0]
    const subCategory = Object.keys(data[category])[0]
    const val = data[category][subCategory]
    const setup = await setupModel.find()
    
    if(setup.length > 0)
    {

        const update = await setupModel.findOneAndUpdate({},{$push:{[`${category}.${subCategory}`] : val[0]}},{new: true})

        // setup[0][category][subCategory].push({val})
        // setup[0].save()

    }
    else
    {

        const set = await setupModel.create(req.body)
       
        
        const s= set[category][subCategory]
        
        set[category][subCategory].push(val[0])

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
    if(Array.isArray(oldValue))
    {
    const setup = await setupModel.findOneAndUpdate({[`${category}.${subCategory}`]: oldValue[0]},{$set:{[`${category}.${subCategory}.$[elem]`]: val}},{
        // [`${category}.${subCategory}.$[elem]`]
            arrayFilters: [{'elem': oldValue[0]}]
          
    })
    }
else
{
  
   const setup = await setupModel.findOneAndUpdate({[`${category}.${subCategory}._id`]: new ObjectId(oldValue._id)},{[`${category}.${subCategory}.$[elem]`]: val},{
    arrayFilters:[{'elem._id': new ObjectId(oldValue._id)}]
   }) }
    // setup[category][subCategory].pull(oldValue[0])
    // setup[category][subCategory].push([val])
    // setup.save()


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
exports.getAllSetups = CatchAsyncError(async(req,res)=>{
  
    // const{category,subCategory} = req.params
 
  
     // const category = Object.keys(data)[0]
     // const subCategory = Object.keys(data[category])[0]
     // const val = data[category][subCategory][0]
 
     const setup = await setupModel.find()
 
     res.status(200).json({
         success: true,
         setup
     })
 })

 exports.getAllTax = CatchAsyncError(async (req, res) => {
    try {
      const getAllTax = await setupModel.find({});
      let tax = getAllTax[0];
      const taxRates = tax.finance.taxRates;
      if (taxRates)
        res.status(200).json({ success: true, tax: tax.finance.taxRates });
      else
        res.status(400).json({ success: false, message: "Failed fetch Taxes" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    }
  });