const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateToken(id,premium) {
    return jwt.sign({ id: id, premium:premium }, process.env.JWT_SECRET_KEY);
}

module.exports = async (req, res) => {
    try {
        const userData = await UserModel.userLogin(req.body.email);
        bcrypt.compare(req.body.pass, userData.dataValues.Password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Something went wrong', });
            }
            if (result) {
                return res.status(202).json({ success: true, message: 'Login successful', token: generateToken(userData.dataValues.id,userData.dataValues.PremiumUser) });
            }
            else {
                return res.status(401).json({ success: false, message: 'Password does not match' });
            }
        });

    } catch (err) {
        res.status(404).json({ success: false, message: 'Account does not exist. Create account.' })
    }

}