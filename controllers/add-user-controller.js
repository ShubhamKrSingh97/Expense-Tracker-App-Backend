const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    let { name, email, pass } = req.body;
    bcrypt.hash(pass, 10, async (err, password) => {
        let user = new UserModel(name, email, password);
        try {
            await user.addUser();
            return res.status(202).json({ message: "Sign-up complete!" });
        } catch (err) {
            return res.status(400).json({ message: "Account with this email already exists." });
        }
    })
}