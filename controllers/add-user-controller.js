const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

module.exports = async (req, res) => {
    const transactions =await sequelize.transaction();
    let { name, email, pass } = req.body;
    bcrypt.hash(pass, 10, async (err, password) => {
        let user = new UserModel(name, email, password);
        try {
            await user.addUser({transactions});
            await transactions.commit();
            return res.status(202).json({ message: "Sign-up complete!" });
        } catch (err) {
            await transactions.rollback();
            return res.status(400).json({ message: "Account with this email already exists." });
        }
    })
}