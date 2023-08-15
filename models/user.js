const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User',new mongoose.Schema({
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
    }
}))

function validateUser(user){
    const schema ={
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;