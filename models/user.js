const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Data = sequelize.define('users', {
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
module.exports = class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password
    };
    addUser() {
        return Data.create({
            Name: this.name,
            Email: this.email,
            Password: this.password
        });
    };
    static userLogin(email){
        return Data.findOne({
            where:{Email:email}
        });
    };
};