const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
    email: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('User', User);
