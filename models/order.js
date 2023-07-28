const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderid: {
        type:String,
        required: true
    },
    paymentid: {
        type:String,
    },
    status: {
        type:String,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});
const Order = mongoose.model('Oder', orderSchema);

module.exports = Order;