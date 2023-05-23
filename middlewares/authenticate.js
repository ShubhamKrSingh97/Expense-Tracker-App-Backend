const {UserModel} = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = async (req, res,next) => {
    try {
        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token, 'SECRET_KEY');
        const user = await UserModel.findUser(decodedToken.id);
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'You are not authenticated' });
    }

};