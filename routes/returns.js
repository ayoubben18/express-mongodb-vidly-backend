const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental.js');
const auth = require('../middleware/auth');
const { Movie } = require('../models/movie.js');



router.post('/',auth,  async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('customerId not provided');
    if(!req.body.movieId) return res.status(400).send('movieId not provided');

    const rental = await Rental.lookup(req.body.customerId,req.body.movieId)

   
    if(!rental) return res.status(404).send('Rental not found');
    if(rental.dateReturned){
        return res.status(400).send('Return is already processed.');
    } 

    rental.return();

    await rental.save();

    await Movie.updateOne({_id:rental.movie._id},{
        $inc: {numberInStock :1}
    });

    return res.send(rental);
});



module.exports = router;