const {sequelize}=require('../util/database');
const Sequelize=require('sequelize');
const {User}=require('./user');
const Order=sequelize.define('orders',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true
    },
    orderid:Sequelize.STRING,
    paymentid:Sequelize.STRING,
    status:Sequelize.STRING
});
User.hasMany(Order,{ foreignKey: 'userId' });
Order.belongsTo(User,{ foreignKey: 'userId' });

module.exports=Order;