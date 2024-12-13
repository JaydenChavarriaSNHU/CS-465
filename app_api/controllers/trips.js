const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');


// GET: /trips - lists all the trips
// Reguardless of outcome, response must include HTML status code
// and JSON messageto the requesting client
const tripsList = async(req, res) => {
    try {
        const trips = await Model.find({}).exec();
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
};

// GET: /trips/:tripCode - lists all the trips
// Reguardless of outcome, response must include HTML status code
// and JSON messageto the requesting client
const tripsFindByCode = async(req, res) => {
    try {
        const trip = await Model.find({ 'code': req.params.tripCode }).exec();
        if (!trip || trip.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json({ message: 'Error finding trip', error: err });
    }
};

// POST: /trips - Adds a new Trip
// Reguardless of outcome, response must include HTML status code
// and JSON message to the requesting client

const tripsAddTrip = async (req, res) => {
    try {
        if (!req.auth || !req.auth.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const trip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        return res.status(201).json(trip);
    } catch (err) {
        return res.status(400).json({ message: 'Error creating trip', error: err });
    }
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    try {
        if (!req.auth || !req.auth.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const trip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({
                message: `Trip not found with code ${req.params.tripCode}`
            });
        }

        return res.status(200).json(trip);
    } catch (err) {
        console.error('Update error:', err);
        return res.status(500).json({
            message: 'Error updating trip',
            error: err.message
        });
    }
};

const tripsDeleteTrip = async (req, res) => {
    try {
      const tripCode = req.params.tripCode;
      const deletedTrip = await Trip.findOneAndDelete({ code: tripCode });
      
      if (!deletedTrip) {
        return res.status(404).json({ "message": "Trip not found" });
      }
      
      res.status(204).json(null);
    } catch (err) {
      res.status(500).json({ "message": err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};

