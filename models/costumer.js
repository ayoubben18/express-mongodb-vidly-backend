const mongoose = require('mongoose');
const Joi = require('joi');

const Costumer = mongoose.model('Costumer', new mongoose.Schema({
    name:{
      type:String,
      required:true,
      minlength:5,
      maxlength:50,
    },
    isGold:{
      type:Boolean,
      default:false,
   },
    phone:{
      type:String,
      required:true,
      length:10,
    },
  }));

  function validateCostumer(costumer) {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      phone:Joi.string().min(10).max(10).required(),
      isGold:Joi.boolean()
    };
  
    return Joi.validate(costumer, schema);
  }
  exports.Costumer = Costumer;
  exports.validate = validateCostumer;

  