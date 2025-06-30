const jwt = require('jsonwebtoken')
// const encrypt = require("../utils/")
const SendToken = (user,res,statusCode)=>{
   


    const token = user.getJwtToken()
                       

    const options={
        expires: new Date(Date.now() +  1*24 *60 * 60 * 1000 ),
        httpOnly: true, 
        sameSite: 'none',
        path: '/', 
        secure:true
    }
    
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        message: "Token Is Sent",
        token,
        user
    })
}

module.exports = SendToken