var Model = require('../models/collectionitem.model');


exports.list = function(req, res) {

    // sort+order
    // ???
    
    //limit, skip 
    let limit = req.query.limit || 10;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;


    let options = {
        sort: {
            dateAdded: -1
        }
        // ,limit: limit,
        // skip: skip
    }

    let q = {};
    if(req.query.list) q.list = req.query.list;
    if(req.query.user) q.user = req.query.user;
    

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
        console.log(err);
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


//query param, comma separated list of movie IDs to check
//user ID also required
exports.watched = function(req, res) {
    

    let {user, movies} = req.query;

    let ids = movies.split(',').map(m => parseInt(m));
    let q1 = {tmdb_id: {$in: ids}};
    let q2 = {user: user};

    Model.find({$and: [q1,q2]},'tmdb_id list').exec((err,docs) => {
        if(err)
        {
            res.status(400).send();
        }
        else
        {
            let result = {};
            docs.forEach(d => result[d.tmdb_id] = d.list);
            res.json(result)
        }
    })
}


//update LIST
//Post object with user and tmdbID and new list value to "move" lists
exports.updateList = function(req, res) {

    const filter = { user: req.body.user, tmdb_id: req.body.tmdb_id};
    const update = { list: req.body.list };

    Model.findOneAndUpdate(filter, update, {new: true, upsert: true, setDefaultsOnInsert: true}, function(error, doc) {
        if(error)
        {
            res.status(400).send('Adding new item failed');
        }
        else
        {
            res.status(200).json(doc);
        }
    });
}