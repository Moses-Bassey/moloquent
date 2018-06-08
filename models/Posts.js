

const  mongoose = require('mongoose');
const {Schema} = mongoose;
const Model = require('../Packages/Model');
const population = [
    { path : 'user' },
    { path : 'comments.user' },
    { path :  'ratings.user' }
];

const projections = {
    comments : {$slice : [-5, 5]},
    likes : {$size : 'likes'}
}



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


postSchema.loadClass(class postClass extends Model{
    static finder(query ={}, single = false){
        return new Promise((resolve, reject)=>{
            this.aggregate([
                {$match : query},
                {$addFields : {
                    likes : {$size : '$likes'}, 
                    liked : true, 
                    numComments : {$size : '$comments'},
                    rated : true,
                    rating : {$avg : '$ratings.rating'},
                    ratings : {$slice : ['$ratings', -5, 5]},
                    comments : {$slice : ['$comments', -5, 5]}
                 } },
                 ...(single ? [{$limit : 1}]: [])
                 ,{
                     $addFields : {
                         rating : {$cond : ['$rating','$rating', 0]},
                         ratings : {$cond : [{$isArray : '$ratings'},'$ratings', []]},
                         comments : {$cond : [{$isArray : '$comments'},'$comments', []]}
                        }
                 }
            ]).then(result => this.populate(result, population), reject)
            .then(resolve, reject)
            .catch(reject)
        })
    }
    
    static getOne(query,projection=projections){    
        return new Promise((resolve, reject)=> {
            this.finder(query, true)
            .then(result => resolve(result[0] || null), reject)
            .catch(reject)
        })
    }

    static getOneOrMany(query, projection = projections){
        return super.getOneOrMany(query, projection)
    }

    static get(query, projection=projections){
        return this.finder(query)
    }

    static edit(query, body){
        return super.edit(query, body)
            .populate(population)
    }
})

module.exports = mongoose.model('Post', postSchema);