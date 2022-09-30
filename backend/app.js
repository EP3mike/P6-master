const express = require('express');

const app = express();

// express json parser allows access to request body
app.use(express.json());


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