const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
},
(email, password, done) => {
    User.findOne({ email: email }).exec()
        .then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect email.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));