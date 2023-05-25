const Razorpay = require('razorpay');
const Order = require('../models/order');
const { User } = require('../models/user');

const prePayment = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_cIHFxFYYlAZsr',
            key_secret: 'p2tcuBpfenVGvVKxw4s1YWg'
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
            res.status(202).json({ message: 'You are a Premium User' });
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