# moloquent
A wrapper for mongoose, emulating the eloquent query Builder for PHP

## TODO
 
Lets we are customizing API response to user requesting it and this user for the sake of brevity is identified from the `x-request-user` header. In express we can get the user thus

```js
    req.header['x-request-user']
```


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


 Test all Wrapper methods

- [ ] get(augumented find)                           
    This is your custom query instead of using the traditional find or findOne. It could be aggregation or mapReduce, or normal find with other manipulations, projection and population. By default, it uses ```js Model.find(query, projection={})```

    ```js
        static get(query, projection){
            return this.aggregate([
                
            ])
        }
    ```

- [ ] getOne
    returns a single match for a query or null, this is based on your custome getOne static method, by default it is ```js Model.findOne(query, projection={})```
    
    ```js
        static getOne(query, projection){
            return this.aggregate([

            ])
        }
    ```
- [ ] getOneOrMany                 
    returns an array if query result returns more than one record, returns first result if query returns just a single query              it is based off your ```js Model.get(query, projection)```

- [ ] getOrFail
    returns a Many matches for a query or fail(rejected Promise) if null
    


- [ ] getOneOrFail        
    return a match for a query or fail(rejected Promise) if null

- [ ] getOneAndEdit                                  
    updates a query and return the match of the query based on your custom get query

- [ ] getManyAndEdit                                 
    updates many records and return the matches of the query based on your custom get query

- [ ] getOrCreate                                    
    tries to fetch a result, else create it, usefull when u dont want the modification effect of using an upsert operation

- [ ] edit                                           
    wrapper for findOneAndEdit, but sets the ```js {new : true}``` option

- [ ] editOrFail                                     
    edit a document, fails if no match or error

- [ ] editMany                                 
    edits many document


- [ ] editManyOrFail                                 
- [ ] updateMany                                        
- [ ] delete                                         
- [ ] deleteMany                                     
- [ ] deleteOrFail                                   
- [ ] deleteManyOrFail                               