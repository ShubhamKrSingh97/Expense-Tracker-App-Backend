const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');

const forgotPass = async (req, res) => {
    try {
        const result = await UserModel.userLogin(req.body.email);
        if(result===0){
            throw new Error();
        }
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
            htmlContent: `<a href="http://localhost:4000/update-password?id=${result.id}">Click here</a>`
        });
        return res.status(202).json({ message: 'The reset password link has been successfuly sent to your email' });
    } catch (err) {
        res.status(404).json({ message: 'User with the entered email does not exist!' });
    }

}

const updatePass = async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, password) => {
        try {
            const user=await UserModel.updatePass(password,req.body.id);
            if(user[0]===0){
                throw new Error()
            }
            return res.status(202).json({ message: "Password successfully updated" });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "User does not exist." });
        }
    })
}

module.exports = { forgotPass,updatePass };