const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense_tracker', 'root', 'homomomo', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;