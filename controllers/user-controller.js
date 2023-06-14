const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');
const {sequelize} = require('../util/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const util=require('util');

const hashPassword = util.promisify(bcrypt.hash);
const addUser = async (req, res) => {
    const transactions =await sequelize.transaction();
    let { name, email, pass } = req.body;
     await hashPassword(pass, 10, async (err, password) => {
        let user = new UserModel(name, email, password);
        try {
            await user.addUser({transactions});
            await transactions.commit();
            return res.status(202).json({ message: "Sign-up complete!" });
        } catch (err) {
            console.log(err);
            await transactions.rollback();
            return res.status(400).json({ message: "Account with this email already exists." });
        }
    })
}

function generateToken(id,premium) {
    return jwt.sign({ id: id, premium:premium }, process.env.JWT_SECRET_KEY);
}

const userLogin = async (req, res) => {
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

module.exports={addUser,userLogin};