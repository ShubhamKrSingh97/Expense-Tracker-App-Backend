const Razorpay = require('razorpay');
const Order = require('../models/order');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const {sequelize}=require('../util/database');
require('dotenv').config();
function generateToken(id) {
    return jwt.sign({ id: id, premium: true }, process.env.JWT_SECRET_KEY);
}

const prePayment = async (req, res) => {
    const transactions=await sequelize.transaction();
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_SECRET_KEY
        })
        const orderDetails = await rzp.orders.create({
            amount: 10000,
            currency: 'INR',
        });
        await Order.create({
            orderid: orderDetails.id,
            status: 'PENDING',
            userId: req.user.id,
        },{transactions});
        await transactions.commit();
        res.status(202).json({ orderDetails, key_id: rzp.key_id });
    } catch (err) {
        await transactions.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

const postPayment = async (req, res) => {
    const transactions=await sequelize.transaction();
    let { status, payment_id, order_id } = req.body;
    let userid = req.user.id;
    try {
        if (status === "SUCCESS") {
            await Promise.all([Order.update(
                {
                    status: status,
                    paymentid: payment_id,

                }, { where: { orderid: order_id } },{transactions}
            ),
            User.update(
                {
                    PremiumUser: true
                }, { where: { id: userid } },{transactions})

            ]);
            await transactions.commit();
            return res.status(202).json({ message: 'You are a Premium User', token: generateToken(userid) });
        }
        else {
            await Order.update({
                status: status
            }, { where: { orderid: order_id } },{transactions});
            transactions.commit();
            return res.status(500).json({ message: 'Payment failed' });
        }
    } catch (err) {
        transactions.rollback();
        res.status(500).json({ message: 'Something went very wrong' });
    }

}
module.exports = { prePayment, postPayment };