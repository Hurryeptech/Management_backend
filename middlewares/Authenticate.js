const userModel = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/ErrorHandler")
const CatchAsyncError = require("./CatchAsyncError")
const AdminModel = require("../models/AdminModel")
const SendToken = require("../utils/SendToken")

exports.authenticate = async (req, res, next) => {


    const token = req.headers['authorization']
    if (!token) {
        return next(new ErrorHandler("Login first to continue", 401))
    }

    const bearer = token && token.split(' ')[1]

    const accessToken = bearer

    let decoded={}
    
    
      try {
     decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
      } catch (error) {
        return next(new ErrorHandler("Token Expired",400))
      }

      
    const user = await userModel.findById(decoded.id)
 
    if (!user) {
        return next(new ErrorHandler("Not a User", 401))
    }
  
    req.user = user
    next()
}

exports.authenticateAdmin = async (req, res, next) => {

    const token = req.headers['authorization']

    if (!token) {
        return next(new ErrorHandler("Log in first to continue", 401))
    }
    const bearer = token.split(' ')[1]
    const accessToken = bearer

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (!verified) {
        return next(new ErrorHandler("Your session is expired", 401))
    }

    const admin = await userModel.findById(verified.id)
    if (admin.administrator) {
        req.admin = admin
    }
    else
    {
        return next(new ErrorHandler("Not an Admin",401))
    }

   
    next()
}
exports.authenticateRole =  async (req, res, next) => {
    
    if (!req.user.administrator) {
            return next(new ErrorHandler("Admins can only login", 401))
        }
        next()
    
}