const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const  User = require('../models/user');
const bcrypt = require('bcrypt');
const ForgotPass = require('../models/forgotpass');

const forgotPass = async (req, res) => {
    try {
    const result = await User.findOne({email:req.body.email});
        if (result === 0) {
            throw new Error();
        }
        const forgot = await ForgotPass.create({userId:result.id, isActive: true});
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
            htmlContent: `<a href="/update-password?id=${forgot.id}">Click here</a>`
        });
        return res.status(202).json({ message: 'The reset password link has been successfuly sent to your email' });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: 'User with the entered email does not exist!' });
    }

}

const updatePass = async (req, res) => {
    const forgot = await ForgotPass.findOne( { _id: req.body.id } )
    if (forgot.isActive === false) {
        return res.status(400).json({ message: 'The link has expired' });
    }
    bcrypt.hash(req.body.password, 10, async (err, password) => {
        try {
            const result = await User.updateOne({_id:forgot.userId},{password:password});
            if (result[0] === 0) {
                throw new Error();
            }
            await ForgotPass.updateOne({ _id: req.body.id },{ isActive: false });
            return res.status(202).json({ message: "Password successfully updated" });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "User does not exist." });
        }
    })
}

module.exports = { forgotPass, updatePass };