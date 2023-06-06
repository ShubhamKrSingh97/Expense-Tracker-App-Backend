const {sequelize} = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('users', {
    id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true,
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
    addUser(options) {
        return User.create({
            Name: this.name,
            Email: this.email,
            Password: this.password
        },options);
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
    static updateTotalExp(id,val,options){
        return User.update({
            TotalExpense:val
        },{where:{id:id}},options)
    }
    static getAllUsers(){
        return User.findAll();
    }
    static updatePass(pass,id,options){
        return User.update({
            Password:pass
        },{where:{id:id}},options)
    }
};
module.exports={User,UserModel};