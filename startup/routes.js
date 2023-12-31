const genres = require('../routes/genres');
const rentals = require('../routes/rentals');
const costumers = require('../routes/costumers');
const returns = require('../routes/returns');
const movies = require('../routes/movies');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const express = require('express');


module.exports = function(app){
    app.use(express.json());
app.use('/api/rentals', rentals);
app.use('/api/genres', genres);
app.use('/api/costumers', costumers);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/returns', returns);
app.use('/api/auth', auth);
app.use(error);
}