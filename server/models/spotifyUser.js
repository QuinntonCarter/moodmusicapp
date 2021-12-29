const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotifyUser = new Schema({
    email: {
    // pull from Spotify
        type: String
    },
    country: {
        type: String
    },
    cueAcc: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("SpotifyUser", spotifyUser)