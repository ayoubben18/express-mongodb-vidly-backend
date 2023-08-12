const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi')

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

router.get('/', async (req, res) => {
  const costumers = await Costumer.find().sort({name:1});
  res.send(costumers);
});

router.post('/', async (req, res) => {
  const { error } = validateCostumer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let costumer = new Costumer({
     name: req.body.name,
     phone:req.body.phone,
     isGold:req.body.isGold,
    });
  costumer = await costumer.save();
  res.send(costumer);
});

function validateCostumer(costumer) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    phone:Joi.string().min(10).max(10).required(),
    isGold:Joi.boolean()
  };

  return Joi.validate(costumer, schema);
}

module.exports = router;