

const mongoose = require('mongoose');
const {Schema} = mongoose;
const Model = require('../Packages/Model');
const userSchema = new Schema({
    fullname : {type: String, required: true},
    email : {type: String, required: true},
    gender : {type: String, enum: ['male', 'female'], lowercase: true, required: true},
    created : {type: Date, 'default': Date.now}
})



userSchema.loadClass(class userClass extends Model{

})

module.exports = mongoose.model('User', userSchema);