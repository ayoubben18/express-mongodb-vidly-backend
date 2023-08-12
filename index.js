const genres = require('./routes/genres');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/vidly')
    .then(() => console.log('connected to mongo db'))
    .catch(err => console.error('Could not connect ', err));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));