const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const{sequelize}=require('../util/database');
const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');
const { Forgot, ForgotPassModel } = require('../models/forgotpass');
const forgotPass = async (req, res) => {
    const transactions=await sequelize.transaction();
    try {
        const result = await UserModel.userLogin(req.body.email);
        if (result === 0) {
            throw new Error();
        }
        const userobj = new ForgotPassModel(true, result.id);
        const user = await userobj.addRequest({transactions});
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_API_KEY;
        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'shubhkrsingh.1997@gmail.com'
        }
        const receivers = [{
            email: req.body.email
        }];

        await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password Link',
            htmlContent: `<a href="http://localhost:4000/update-password?id=${user.id}">Click here</a>`
        });
        await transactions.commit();
        return res.status(202).json({ message: 'The reset password link has been successfuly sent to your email' });
    } catch (err) {
        await transactions.rollback();
        res.status(404).json({ message: 'User with the entered email does not exist!' });
    }

}

const updatePass = async (req, res) => {
    const transactions=await sequelize.transaction();
    const user = await Forgot.findOne({ where: { id: req.body.id } })
    if (user.dataValues.isActive === false) {
        return res.status(400).json({ message: 'The link has expired' });
    }
    bcrypt.hash(req.body.password, 10, async (err, password) => {
        try {
            const result = await UserModel.updatePass(password, user.dataValues.userId,{transactions});
            if (result[0] === 0) {
                throw new Error()
            }
            await Forgot.update({ isActive: false }, { where: { id: req.body.id } })
            await transactions.commit();
            return res.status(202).json({ message: "Password successfully updated" });
        } catch (err) {
            console.log(err);
            await transactions.rollback();
            return res.status(400).json({ message: "User does not exist." });
        }
    })
}

module.exports = { forgotPass, updatePass };