const Razorpay = require('razorpay');
const Order = require('../models/order');
const { User } = require('../models/user');
const jwt=require('jsonwebtoken');

function generateToken(id){
    return jwt.sign({ id: id, premium:true },'secret_key');
}


const prePayment = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const orderDetails = await rzp.orders.create({
            amount: 10000,
            currency: 'INR',
        });
        await Order.create({
            orderid: orderDetails.id,
            status: 'PENDING',
            userId: req.user.id,
        })
        res.status(202).json({ orderDetails, key_id: rzp.key_id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

const postPayment = async (req, res) => {
    try {
        if (req.body.status === "SUCCESS") {
            await Order.update({
                status: req.body.status,
                paymentid: req.body.payment_id,

            }, { where: { orderid: req.body.order_id } });


            await User.update({
                PremiumUser: true
            }, { where: { id: req.user.id } });
            return res.status(202).json({ message: 'You are a Premium User',token:generateToken(req.user.id)});
        }
        else {
            await Order.update({
                status: req.body.status
            }, { where: { orderid: req.body.order_id } });
            return res.status(500).json({ message: 'Payment failed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went very wrong' });
    }

}
module.exports = { prePayment, postPayment };