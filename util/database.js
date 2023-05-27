const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense_tracker', 'root', process.env.DB_PASS, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;