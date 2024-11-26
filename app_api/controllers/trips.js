const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');


// GET: /trips - lists all the trips
// Reguardless of outcome, response must include HTML status code
// and JSON messageto the requesting client
const tripsList = async(req, res) => {
    const q = await Model
    .find({}) // No filter, return all records
    .exec();

    // Uncomment the following line to show results of the query on the console
    // console.log(q);

    if(!q){
        // Database returned no data
        return res
                .status(404)
                .json(err);
    }
    else{
        return res
                .status(200)
                .json(q);
    }
};

module.exports = {
    tripsList
};

// GET: /trips/:tripCode - lists all the trips
// Reguardless of outcome, response must include HTML status code
// and JSON messageto the requesting client
const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode }) // Returns a single record
        .exec();

    // Uncomment the following line to show results of the query on the console
    // console.log(q);

    if(!q){
        // Database returned no data
        return res
                .status(404)
                .json(err);
    }
    else{
        return res
                .status(200)
                .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};