const mongoose = require("mongoose")

const announcementSchema = new mongoose.Schema({

    date:{
        type: Date
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    isSeen: {
        type: Boolean,
        default: false, 
      },
      userId:[
        {
            type: mongoose.Types.ObjectId
        }
      ]
})

module.exports = mongoose.model("Announcement",announcementSchema)