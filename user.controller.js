var Model = require('./user.model');

exports.login = function(req, res) {

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