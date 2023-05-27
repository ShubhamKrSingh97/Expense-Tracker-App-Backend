const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('users', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
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
    },
    PremiumUser:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    TotalExpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});
 class UserModel {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password
    };
    addUser() {
        return User.create({
            Name: this.name,
            Email: this.email,
            Password: this.password
        });
    };
    static userLogin(email){
        return User.findOne({
            where:{Email:email}
        });
    };
    static findUser(id){
        return User.findOne({
            where:{id:id}
        });
    }
    static updateTotalExp(id,val){
        return User.update({
            TotalExpense:val
        },{where:{id:id}})
    }
    static getAllUsers(){
        return User.findAll();
    }
};
module.exports={User,UserModel};