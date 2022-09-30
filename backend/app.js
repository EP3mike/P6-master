const express = require('express');
const mongoose = require('mongoose');

const app = express();

// express json parser allows access to request body
app.use(express.json());

// connects to our mongoDB database
mongoose.connect('mongodb+srv://p6-user:project6user@cluster0.kek3m1f.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

// middleware to prevent a CORS ERROR(adds the right headers to allow requests from different source)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res) => {
    res.json({message: 'Request was successful'});
});

module.exports = app;