const User = require('../models/User');


module.exports = class UsersController{
    static get(req, res){
        User.getOneOrMany(req.params.user ? {
            _id : req.params.user
        }: {})
        .then(user => res.json(user))
        .catch(err => res.json(err.toString()))
    }

    static create(req, res){
        User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err.toString()))
    }

    static delete(req, res){
        User.delete({_id : req.params.user})
        .then(user => res.json(user))
        .catch(err => res.json(err.toString()))
    }

    static update(req, res){
        User.edit({_id : req.params.user}, {$set : req.body})
        .then(user => res.json(user))
        .catch(err => res.json(err.toString()))
    }
}