const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength:5,
        maxlength:255,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:255
    },
    isAdmin:{
        type:Boolean,
        default:true,
        required:true
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema ={
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        isAdmin:Joi.boolean().required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;