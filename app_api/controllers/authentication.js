const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    try {
        await user.save();
        const token = user.generateJwt();
        res
            .status(200)
            .json({token});
    } catch (err) {
        res
            .status(400)
            .json(err);
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "Missing credentials"});
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json(err);
        }

        if (!user) {
            return res
                .status(401)
                .json(info || { message: "Invalid email or password" });
        }

        const token = user.generateJwt();
        res
            .status(200)
            .json({token});
    })(req, res);
};
module.exports = {
register,
login
};