const Razorpay = require('razorpay');
const Order = require('../models/order');
const  User  = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateToken(id) {
    return jwt.sign({ id: id, premium: true }, process.env.JWT_SECRET_KEY);
}

const prePayment = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        })
        const orderDetails = await rzp.orders.create({
            amount: 10000,
            currency: 'INR',
        });
        await Order.create({
            orderid: orderDetails.id,
            status: 'PENDING',
            userId: req.user.id,
        });
        res.status(202).json({ orderDetails, key_id: rzp.key_id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

const postPayment = async (req, res) => {
    let { status, payment_id, order_id } = req.body;
    let userid = req.user.id;
    console.log("User",userid);
    try {
        if (status === "SUCCESS") {
            await Promise.all([Order.updateOne(
                { orderid: order_id },
                {
                    status: status,
                    paymentid: payment_id,

                }
            ),
            User.updateOne({ _id: userid },
                {
                    premiumUser: true
                })

            ]);
            return res.status(202).json({ message: 'You are a Premium User', token: generateToken(userid) });
        }
        else {
            await Order.updateOne({ orderid: order_id },
                {
                    status: status
                });
            return res.status(500).json({ message: 'Payment failed' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went very wrong' });
    }

}
module.exports = { prePayment, postPayment };