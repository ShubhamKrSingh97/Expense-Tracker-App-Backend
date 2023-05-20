const User = require('../models/user');

module.exports=async (req, res) => {
    try {
        const userData = await User.userLogin(req.body.email);

        if (userData.dataValues.Password != req.body.pass) {
            res.status(401).json({ success: false, message: 'Password does not match' });
        }
        else {
            return res.status(202).json({ success: true, message: 'Login successful' });
        }
    } catch (err) {
        res.status(404).json({ success: false, message: 'Account does not exist. Create account.' })
    }

}