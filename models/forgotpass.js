const Sequelize=require('sequelize');
const {sequelize}=require('../util/database');
const {User}=require('./user');
const Forgot=sequelize.define('forgotpasswords',{
    id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    userId:{
        type:Sequelize.UUID
    }
});
User.hasMany(Forgot,{ foreignKey: 'userId' });
Forgot.belongsTo(User,{ foreignKey: 'userId' });

const ForgotPassModel=class ForgotPass{
    constructor(isActive,userId){
        this.isActive=isActive,
        this.userId=userId
    }
    addRequest(options){
        return Forgot.create({
            isActive:this.isActive,
            userId:this.userId
        },options)

    }
}

module.exports={Forgot,ForgotPassModel};