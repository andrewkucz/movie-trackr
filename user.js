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

const Model = mongoose.model('User', User)


const login = function(req, res) {

    const filter = { _id: req.body.sub};
    const newDoc = {
        name: req.body.name,
        picture: req.body.picture,
        email: req.body.email,
        lastLogin: Date.now()
    };

    Model.findOneAndUpdate(filter, newDoc, {new: true, upsert: true, setDefaultsOnInsert: true }).then(doc => {
        res.json(doc);
    }).catch(err => {
        console.log(err);
        res.status(400).send('Upsert Error');
    });


}

module.exports = {
    login
};
