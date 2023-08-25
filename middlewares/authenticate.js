const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res,next) => {
    try {
        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'You are not authenticated' });
    }

};  