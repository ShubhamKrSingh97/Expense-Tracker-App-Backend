const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_ACC, process.env.DB_PASS, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;