const nodemailer = require("nodemailer")

const sendMail =async (Options)=>{

    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'hurryepworks@gmail.com',
            pass: 'rodlidozdakbdhpt'
            }
    })

    const mail = await transport.sendMail(Options)
     
    if(mail)
    {
        return true
    }

    return false
}

module.exports = sendMail