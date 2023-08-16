const {Costumer,validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
  const costumers = await Costumer.find().sort({name:1});
  res.send(costumers);
});

router.post('/',auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let costumer = new Costumer({
     name: req.body.name,
     phone:req.body.phone,
     isGold:req.body.isGold,
    });
  costumer = await costumer.save();
  res.send(costumer);
});


module.exports = router;