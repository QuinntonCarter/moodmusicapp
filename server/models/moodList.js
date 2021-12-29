const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodList = new Schema({
    items: [{
        selectionName: {
        type: String
        },
        genres:[String],
        image: { 
            type: String
        },
        href: {
            type: String
        },
        type: {
            type: String
        }
    }],
    type: {
        type: String,
        default: 'moodList'
    },
    created: {
        type: Date,
        default: Date.now
    },
    cueUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userString: String,
    timeline: String
})

module.exports = mongoose.model("MoodList", moodList)