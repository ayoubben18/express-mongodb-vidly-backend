const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const rentals = require('./routes/rentals');
const costumers = require('./routes/costumers');
const movies = require('./routes/movies');
const users = require('./routes/users');
const express = require('express');
const auth = require('./routes/auth');
const app = express();
const mongoose = require('mongoose');

if(!config.get('jwtPrivateKey')){
    console.log("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1:27017/vidly')
    .then(() => console.log('connected to mongo db'))
    .catch(err => console.error('Could not connect ', err));

app.use(express.json());
app.use('/api/rentals', rentals);
app.use('/api/genres', genres);
app.use('/api/costumers', costumers);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/auth', auth);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));