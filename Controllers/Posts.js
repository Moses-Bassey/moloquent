
const Post = require('../models/Posts');
const {ObjectId} = require('mongoose').Types

module.exports = class PostsController{
    static get(req, res){
        Post.getOneOrMany(req.params.post && {_id : req.params.post})
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static create(req, res){
        Post.createThenGet(req.body)
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static delete(req, res){
        Post.delete({_id : req.params.post})
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static update(req, res){
        Post.edit({_id : req.params.post},req.body)
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static like(req, res){
        Post.getOneAndEdit({_id : ObjectId(req.params.post)},{_id : ObjectId(req.params.post),'likes.user' : {$ne : ObjectId(req.params.user)} },{$addToSet : {likes : {user : req.params.user} } } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static unlike(req, res){
        Post.editOne({_id : ObjectId(req.params.post)}, {$pull : {likes : {user : req.params.user} } })
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static comment(req, res){
        Post.editOne({_id : ObjectId(req.params.post)},{$push : {comments : req.body} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static deleteComment(req, res){
        Post.editOne({_id : ObjectId(req.params.post), 'comments._id' : req.params.comment},{$pull : {comments : {_id : req.params.comment}} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }


    static editComment(req, res){
        Post.editOne({_id : ObjectId(req.params.post), 'comments._id' : req.params.comment},{$set : {'comments.$' : req.body} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static rate(req, res){
        Post.getOneAndEdit({_id : ObjectId(req.params.post)}, {_id : ObjectId(req.params.post),'ratings.user' : {$ne : ObjectId(req.body.user)} }, {$push : {ratings : req.body}})
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }
}