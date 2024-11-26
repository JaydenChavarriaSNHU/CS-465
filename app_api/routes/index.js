const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

//define route for our trips endpoint
router
        .route('/trips')
        .get(tripsController.tripsList); // GET Mooethod routes tripList


// GET Method routes tripsFindByCode - requires parameter
router
        .route('/trips/:tripCode')
        .get(tripsController.tripsFindByCode);

module.exports = router;