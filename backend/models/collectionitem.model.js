const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CollectionItem = new Schema({
    user: {
        type: String,
        required: true
    },
    tmdb_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    poster: {
        type: String
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    list: {
        type: String,
        enum: ['seen','watch']
    }

});

module.exports = mongoose.model('CollectionItem', CollectionItem);
