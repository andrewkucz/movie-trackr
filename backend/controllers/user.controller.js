var Model = require('../models/user.model');


exports.list = function(req, res) {

    // sort+order
    
    //limit, skip 

    let limit = req.query.limit || 10;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;


    let options = {
        sort: {
            dateAdded: -1
        },
        limit: limit,
        skip: skip
    }

    let q = req.query.list ? { list: req.query.list } : {};

    Model.find(q, null, options, function (err, objs) {
        if (err) {
            res.status(400).send('Error getting objects');
            console.log(err);
        } else {
            res.json(objs);
        }
    });
}

exports.create = function(req, res) {

    let obj = new Model(req.body);
    obj.save()
    .then(obj => {
        res.status(200).json(obj);
    })
    .catch(err => {
        //console.log(err);
        res.status(400).send('Adding new item failed');
    });
}

exports.read = function(req, res) {
    let id = req.params.id;
    Model.findById(id, function(err, obj) {
        if(err)
        {
            res.status(400).send('error getting object');
        }
        else
        {
            res.json(obj);
        }
    });
}

exports.update = function(req, res) {
    let id = req.body._id;
    if(!id)
    {
        res.status(400).send('Object supplied did not have ID');
    }
    else
    {
        Model.findById(id, function(err, obj) {
            if (!obj)
            {
                res.status(404).send("Object with supplied ID not found");
            }
            else if (err)
            {
                res.status(400).send('Error')
            }
            else
            {
                let newobj = req.body;
                
                Object.keys(newobj).forEach(field => {
                    obj[field] = newobj[field];
                });
                obj.save().then(obj => {
                    res.json({
                        status: 'Success',
                        data: obj
                    });
                })
                .catch(err => {
                    res.status(400).send("Error updating object");
                });
            }
        });
    }
}

exports.delete = function(req, res) {
    Model.findById(req.params.id, function(err, obj) {
        if (!obj)
            res.status(404).send("data is not found");
        else
            obj.remove().then(obj => {
                res.status(200).send('Deleted successfully');
            })
            .catch(err => {
                res.status(400).send("Error with deletion");
            });
    });
}


exports.check = function(req, res) {

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