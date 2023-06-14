const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_ACC, process.env.DB_PASS, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const Op = Sequelize.Op;

module.exports = { sequelize, Op };
