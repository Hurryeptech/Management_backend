const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"Please Enter title"]
    },
    description:{
        type: String,
        required:[true,"Please Enter description"]
    },
    qty:{
        type: String,
        required:[true,"Please Enter quantity"]
    },
    rate:{
        type: String,
        required:[true,"Please Enter rate"]
    },
    saccode:{
        type: String,
        unique:true,
        required:[true,"Please Enter SAC Code"]
    },
    gst:{
        type: String,
        required:[true,"Please Enter GST%"]
    }
    
})

module.exports = mongoose.model("Item",itemSchema)