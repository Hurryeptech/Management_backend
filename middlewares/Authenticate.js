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

    let decoded = {}
    
    try {
         decoded = jwt.verify(accessToken, process.env.REFRESH_TOKEN)
         
       
    } catch (error) {


        const refresh = req.headers['x-refresh-token']

        
        if (!refresh) {
            return next(new ErrorHandler("Login first again , session expired -1", 401))
        }


        try {
             decoded = jwt.verify(refresh, process.env.JWT_SECRET)
             jwt.sign({id: decoded.id},process.env.REFRESH_TOKEN,{expiresIn:'15m'})
             
        } catch (error) {
       
            return next(new ErrorHandler("Login first again , session expired -2", 401))
        }
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

    const admin = await AdminModel.findById(verified.id)
    if (!admin) {
        return next(new ErrorHandler("Not an Valid admin user", 401))
    }

    req.admin = admin
    next()
}
exports.authenticateRole = function (...roles) {

    return async (req, res, next) => {
        if (!(roles.includes(req.admin.role))) {
            return next(new ErrorHandler("Admins can only login", 401))
        }
        next()
    }
}