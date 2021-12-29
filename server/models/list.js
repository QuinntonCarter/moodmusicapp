const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// yearly view of selection (tracks or artists)
const list = new Schema({
    // artist or tracks
    description: {
        type: String
    },
    type: {
        type: String
    },
    ownerProfile: {
        type: String
    },
    owner: {
        type: String
    },
    href: {
        type: String
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    cueUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userString: {
        type: String
    }
})

module.exports = mongoose.model("List", list)