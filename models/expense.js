const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const {User}=require('./user');
const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

        class ExpenseModel {
    constructor(category, amount, description) {
        this.category = category;
        this.amount = amount;
        this.description = description
    }
    addExpense(id) {
        return Expense.create({
            amount: this.amount,
            category: this.category,
            description: this.description,
            userId:id
        });
    }
    static deleteExpense(ID,id) {
        console.log(ID,id);
        return Expense.destroy({
            where: {
                id: ID, userId:id
            }
        });
    }
    static findAllExpenses(id) {
        return Expense.findAll({where:{userId:id}});
    }
}
module.exports={Expense,ExpenseModel};