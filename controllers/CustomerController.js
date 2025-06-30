const CatchAsyncError = require("../middlewares/CatchAsyncError")
const CustomerModel = require("../models/CustomerModel")
const LeadModel = require("../models/LeadModel")
const ErrorHandler = require("../utils/ErrorHandler")
const SendToken = require("../utils/SendToken")
const otplib = require("otplib")


exports.login = CatchAsyncError(async(req,res,next)=>{

    const {email} = req.body
    const customer = await customerModel.findOne({"contactPerson.email": email})
    if(!customer)
    {
        return next(new ErrorHandler("Not a valid customer",401))
    }
    otplib.totp.options= {digits: 6,step: 120}
    const otp = otplib.totp.generate(email+process.env.OTPLIB_SECRET)

    customer.otp = otp
    customer.otpExpire = new Date(Date.now() + 1 * 60 * 1000)
    await customer.save()

    res.json({
        success: true,
        otp
    })
})

exports.verifyOtp = CatchAsyncError(async(req,res,next)=>{

    
    const {otp,email} = req.body

    const customer = await customerModel.findOne({"contactPerson.email": email})
    if(customer.otpExpire  < Date.now())
    {
        customer.otpExpire = undefined,
        customer.otp = undefined
        customer.save()
        return next(new ErrorHandler("Time is exceeded",401))
    }

   

    if(otp !== customer.otp)
    {
        return next(new ErrorHandler("Otp is Wrong",401))
    }

    customer.otp = undefined
    customer.otpExpire = undefined
    customer.lastLogin = new Date()
    await customer.save({validateBeforeSave: false})

    if(!customer)
    {
        return next(new ErrorHandler("Not a Valid User",401))
    }
    SendToken(customer,res,200)

})

exports.addCustomer = CatchAsyncError(async (req, res, next) => {
    const { companyName, gstNo, contact, mobile, email, billing, shipping ,convert} =
      req.body;
    try {
      const addCustom = await CustomerModel.create({
        companyName,
        gstNo,
        contact,
        mobile,
        email,
        active: true,
        billing,
        shipping,
      });
      if (!addCustom) {
        return next(new ErrorHandler("Error in Adding Customer", 400));
      }
      if(JSON.parse(convert))
      {
     
        const s= await LeadModel.findOneAndDelete({email: email})
      }
      res
        .status(200)
        .json({ success: true, message: "Customer Added Successfully" });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        return res.status(400).json({
          success: false,
          message: `Duplicate entry: ${field} "${value}" already exists`,
        });
      }
      return next(new ErrorHandler("Failed to Add Customer", 500));
    }
  });

  exports.getAllCustomers = CatchAsyncError(async (req, res, next) => {
    const customers = await CustomerModel.find();
    if (!customers) {
      return next(new ErrorHandler("No Items Found", 404));
    }
    res.status(200).json({ success: true, customers });
  });

  exports.editCustomer = CatchAsyncError(async (req, res, next) => {
    const {id, companyName, gstNo, contact, mobile, email, billing, shipping } =
      req.body;
  
    try {
      const editCustom = await CustomerModel.findByIdAndUpdate(
        { _id: id },
        { companyName, gstNo, contact, mobile, email, billing, shipping },
        { new: true, upsert: true }
      );
      if (!editCustom) {
        return next(new ErrorHandler("Error in updating Customer", 400));
      }
      res
        .status(200)
        .json({ success: true, message: "Customer Updated Successfully" });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Failed to updating Customer", 500));
    }
  });
  
  exports.deleteCustomer = CatchAsyncError(async (req, res, next) => {
    console.log(req.body)
    const { deleteId } = req.body;
    try {
      const customers = await CustomerModel.findByIdAndDelete({ _id: id });
      if (!customers) {
        return next(new ErrorHandler("Unable to Delete Customer", 400));
      }
      res.status(200).json({ success: true, customers });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Failed to Delete Customer", 500));
    }
  });

  exports.editActive = CatchAsyncError(async (req, res, next) => {
    const { id, active } = req.body;
    try {
      const customers = await CustomerModel.findByIdAndUpdate(
        { _id: id },
        { active: active }
      );
      if (!customers) {
        return next(new ErrorHandler("Error in Edit Cutomer", 400));
      }
      res.status(200).json({ success: true, message: "Customer Updated" });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Failed to Update Customer", 500));
    }
  });

  exports.getCustomers = CatchAsyncError(async(req,res)=>{

    const customers =await CustomerModel.find({},{companyName: 1,_id:1})
   res.status(200).json({
    success: true,
    customers
   })
  })