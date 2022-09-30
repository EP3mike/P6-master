const Sauce = require('../models/sauce');
const fs = require('fs');

// endpoint for get request for all sauces on database
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error:error
            });
        }
    );
};

//endpoint to create a Sauce post
exports.createSauce = (req, res, next) => {

};

//endpoint to retrieve a single Sauce post by its id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};