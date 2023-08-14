const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi')


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100,
    },
    genre:{
        type:genreSchema,
        required:true,
    },
    numberInStock: {
        type:Number,
        required:true,
        default:0,
        max:255,
    },
    dailyRentalRate:{
        type:Number,
        required:true,
        default:0,
        max:255,
    },
}))

function validate(movie) {
    const schema = {
      title: Joi.string().max(100).required(),
      genreId : Joi.string().required(),
      numberInStock:Joi.number().max(255).required(),
      dailyRentalRate:Joi.number().max(255).required(),
    };
  
    return Joi.validate(movie, schema);
  }


exports.Movie = Movie;
exports.validate = validate;