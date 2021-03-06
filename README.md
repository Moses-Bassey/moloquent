

# Moloquent

Inspired by laravel's eloquent.

To use, add it to your model class
```js
const {Model} = require('moloquent');
thatModelSchema.loadClass(class thatModelClass extends Model{

})
```

This package is useful for projects where you have a complex query for getting a model by default instead of the traditional `find` or `findOne` query.

It assumes you will use the `get` and `getOne` methods to wrap your custom query. This could be an `aggregate`, `mapReduce` or maybe `find` or `findOne` with lots of projection and other set up. This way you only get to write them once and resuse them for operations like updates (instead of using `findOneAndUpdate`) and create.


A common example is a model that includes rating. Normally you dont show it as is; you have to aggregate to show the average rating. Then your get query becomes..

```js
    const {Model} = require('moloquent');
    //mongoose schema and all the other setups
    thatModel.loadClass(class thatModelClass extends Model{
        static get(){
            return this.aggregate([
                //calculate avergage rating, paginate the actual rating array
            ])
        }

        static getMany(){
            return this.aggregate([
                //paginate results, calculate average rating, paginate actula rating array
            ])
        }
        
        //other custom model methods
    })
```


## Methods


- `get`
    Defaults to `find`. This can be overrriden to become your custom method of showing your model to the user. It returns an array of mathces or an empy array if none was matched.

- `getOne`
    Defaults to `findOne`. This also can be overridden like the `get` method to customize the way you show your model.

- `getOneOrMany`
    Based on your `get` methods, if the result holds a single match, it returns the single match, else it returns the array as is.

-  `getOrFail`
    returns a rejected promise if result from the `get` method is an empty array. Usefull for verification and Authentication.
    

-  `getOneOrFail`        
    returns a rejected promise if result from `getOne` method is null.

-  `getOrCreate`
    It creates a record if it fails to find a match, based on your `get` query. The result is returned using your `getOne` method.
    It is useful if you dont want to the modification effect of upserts but want to always get a result as you would with upserts.

-   `createThenGet`
    Used for making newly created result consistent with the ones gotten from `getOne`. 


-   `getOneAndEdit`
    Since (at the time of writing), there was no provision for conditional `update`, this allows you set different query for `getOne` and `update`. I use it alot in array of subdocuments which are suppose to be unique, example rating. Since there is no way to check if the record exists during `update` operations and you want to return the result as you would with `getOne`, you use the method.
    ```js
        thatModel.getOneThenEdit(getQuery, editQuery, body){
            //perform update operation
            //the return getOne
        }
    ```

-   `getManyAndEdit`
    same with `getOneAndEdit` but deals with `updateMany` and many results. returns the result using `get`;

-  `edit`
    performs an `update`, then returns the result using `getOne`. Alternatively you can use the `findOneAndUpdate` but this one maintains the result you would achieve with your `getOne` method.

-   `editMany`                                 
    performs an `updateMany`, the returns the result using `get`.

-   `editOrFail`
    performs an `edit`, then returns a rejected promise if no match was found. The use case for this is rare, I think.

-   `editManyOrFail`
    performs an `editMany`, then returns a rejected promise no match was found.

-   `deleteOrFail`
    Tries to delete a record, returns a rejected promise if it no match was found

-   `deleteManyorFail`
    Tries to delete many records, returns a failed promise if no match was found