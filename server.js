
const app = require("./index.js")
const mongoose = require("mongoose")


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Mongodb Connected")
})


app.listen(process.env.PORT,()=>{
    console.log("Server Started",process.env.PORT)
})