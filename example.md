# moloquent

Our Target is to transform Post Objects into

```js
{
    user : {
        fullname,
        email,
        ...
    },
    post : lorem ...,
    time : Date //timeStamp When ItWas Posted,
    rating : Number //average Rating
    rated : Boolean //true if 'x-request-user' has rated it,
    likes : totalNumberOfLikes,
    liked : Boolean //true if 'x-request-user' has liked it,
    comments : {
        user : {fullname, email, ...},
        comment : 'Lorem...'
        time : Date //timeStamp When Comment WasSent
    } //last 5 comments
    numComments : totalNumberOfComments 
}
```

For our Test Model (model.js)
```js
    const { Model } = require('moloquent');
    const mongoose = require('mongoose');
    const {Schema} = mongoose;    

    const postSchema = new Schema({
        user : {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        post : {type: String, required: true},
        time : {type: Date, 'default': Date.now},
        ratings : [{
            rating : {type: Number, min: 1, max: 5, required: true},
            user : {type: Schema.Types.ObjectId, required: true, ref: 'User'}
        }],
        likes : [{
            user : {type: Schema.Types.ObjectId, required: true, ref: 'User'}
        }],
        comments : [{
            user : {type: Schema.Types.ObjectId, required: true, ref: 'User'},
            comment : {type: String, required: true},
            time : {type: Date, 'default': Date.now}
        }]
    })

    class Posts extends Model{
        
    }

    postSchema.loadClass(Posts)
    //export model with a connection
```

Our express Route File

```js
const  router = require('express').Router();
const Controller = require('../Controllers/Posts');
const id = "\\w{24}";

router.get(`/:post(${id})?`, Controller.get);

router.post(`/`, Controller.create);

router.put(`/:post`, Controller.update)

router.delete(`/:post`, Controller.delete);

router.post(`/:post(${id})/comment`, Controller.comment)

router.put(`/:post(${id})/comment/:comment(${id})`, Controller.editComment)

router.delete(`/:post(${id})/comment`, Controller.deleteComment)

router.get(`/:post(${id})/like/:user(${id})`, Controller.like)

router.get(`/:post(${id})/unlike/:user(${id})`, Controller.unlike)

router.post(`/:post(${id})/rating`, Controller.rate)

module.exports = router;
```

The Controller (Controller.js)

```js
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
        Post.edit({_id : ObjectId(req.params.post)}, {$pull : {likes : {user : req.params.user} } })
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static comment(req, res){
        Post.edit({_id : ObjectId(req.params.post)},{$push : {comments : req.body} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static deleteComment(req, res){
        Post.edit({_id : ObjectId(req.params.post), 'comments._id' : req.params.comment},{$pull : {comments : {_id : req.params.comment}} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }


    static editComment(req, res){
        Post.edit({_id : ObjectId(req.params.post), 'comments._id' : req.params.comment},{$set : {'comments.$' : req.body} } )
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }

    static rate(req, res){
        Post.getOneAndEdit({_id : ObjectId(req.params.post)}, {_id : ObjectId(req.params.post),'ratings.user' : {$ne : ObjectId(req.body.user)} }, {$push : {ratings : req.body}})
        .then(post => res.json(post))
        .catch(err => res.json(err.toString()))
    }
}

```