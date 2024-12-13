const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'payload'
});

// Import your controllers
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

// Public routes (no auth required)
router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/trips')
    .get(tripsController.tripsList)  // Public access to view trips
    .post(auth, tripsController.tripsAddTrip);  // Auth required to add trips

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)  // Public access to view specific trip
    .put(auth, tripsController.tripsUpdateTrip)  // Auth required to update trips
    .delete(auth, tripsController.tripsDeleteTrip);

module.exports = router;