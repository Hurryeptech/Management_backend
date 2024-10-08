const jwt = require('jsonwebtoken')

const SendToken = (user,res,statusCode)=>{
   

    
    const token = jwt.sign({id:user.id},process.env.REFRESH_TOKEN,{expiresIn: '15m'})
    const refreshToken = user.getJwtToken()
                       

    const options={
        expires: new Date(Date.now() +  1*24 *60 * 60 * 1000 ),
        httpOnly: true,
        secure: true
    }
    
    res.status(statusCode).cookie('accessToken',token,options).cookie('refreshToken',refreshToken,options).json({
        sucess: true,
        message: "Token Is Sent",
        token,
        refreshToken,
        user
    })
}

module.exports = SendToken