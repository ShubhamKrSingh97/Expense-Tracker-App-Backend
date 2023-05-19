const User = require('../models/user');

module.exports = async (req, res) => {
    let { name, email, pass } = req.body;
    let user = new User(name, email, pass);
    try {
        await user.addUser();
        res.status(202).json({ message: "Sign-up complete!" });
    } catch (err) {
        res.status(400).json({ message: "Account with this email already exists." });
    }

}