const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
function generateToken(id) {
    return jwt.sign({ id: id }, 'secret_key');
}

module.exports = async (req, res) => {
    try {
        const userData = await UserModel.userLogin(req.body.email);
        bcrypt.compare(req.body.pass, userData.dataValues.Password, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Something went wrong', });
            }
            if (result) {
                return res.status(202).json({ success: true, message: 'Login successful', id: generateToken(userData.dataValues.id) });
            }
            else {
                return res.status(401).json({ success: false, message: 'Password does not match' });
            }
        })

    } catch (err) {
        return res.status(404).json({ success: false, message: 'Account does not exist. Create account.' })
    }

}