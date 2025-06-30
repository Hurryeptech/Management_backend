const CatchAsyncError = require("../middlewares/CatchAsyncError");
const LeadModel = require("../models/LeadModel");
const ErrorHandler = require("../utils/ErrorHandler");
const {findAddressByPincode} = require("../utils/Findaddress")
exports.createLead = CatchAsyncError(async(req,res)=>{

    // const {status,source,assignee,heatness,phone,fname,lname,email} = req.body
 
    if(req.body.datas)
        {
    const data = req.body
  const bulk=  req.body.datas.map((sd)=>{
        sd.status = data.status
        sd.source = data.source
        sd.salesOwner = data.salesOwner
    })
  
    
        const lead = await LeadModel.insertMany(req.body.datas)
       
       return  res.status(201).json({
            success: true
        })
    }

    const lead = await LeadModel.create(req.body)

    res.status(201).json({
        success: true,
        message:"Lead Created"
    })


})

exports.getLead = CatchAsyncError(async(req,res)=>{


    // res.status(200).json({
    //     message: "created"
    // })
    
    const leads = await LeadModel.find()

    if(leads.length < 0)
    {
        return next(new ErrorHandler("No records found",204))
    }
    res.json({
        success: true,
        leads
    })
})

exports.getSingleLead = CatchAsyncError(async(req,res)=>{

    const {leadId} = req.params

    const lead = await LeadModel.findById(leadId)
    if(!lead)
    {
        return next(new ErrorHandler("No Record Found",404))
    }

    res.status(200).json({
        success: true,
        lead
    })
})

exports.updateLead = CatchAsyncError(async(req,res)=>{

    const {leadId} = req.params
     const lead = await LeadModel.findByIdAndUpdate(leadId,req.body,{new:true})
    
     res.status(200).json({
        success: true,
        lead
     })
})

exports.getAddress = async (req, res) => {
    try {
      const { pincode } = req.params;
      
      if (!pincode) {
        return res.status(400).json({ message: "Pincode is required" });
      }
    
      const addressData = await findAddressByPincode(pincode);
      
      if (addressData) {
        const { community, place, province, state, country } = addressData;
        const data = {
          community,
          place,
          province,
          state,
          country,
        };
        return res
          .status(200)
          .json({ message: "Address Fetched", success: true, addressData: data });
      } else {
        return res.status(404).json({
          message: "Address not found",
          success: false,
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch address", error });
    }
  };
exports.checkEmail= CatchAsyncError(async(req,res)=>{

  const {email} = req.params
 
  const valid = await LeadModel.findOne({email: email})
  if(valid)
  {
   return res.status(200).json({
      success: true,
      valid: false
    })
  }
  res.status(200).json({
    suucess: true,
    valid: true
  })
})

