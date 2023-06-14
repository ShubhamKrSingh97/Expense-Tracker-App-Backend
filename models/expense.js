const {sequelize} = require('../util/database');
const Sequelize = require('sequelize');
const {User}=require('./user');
const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
    },
  
});
User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

        class ExpenseModel {
    constructor(category, amount, description) {
        this.category = category;
        this.amount = amount;
        this.description = description
    }
    addExpense(id,options) {
        return Expense.create({
            amount: this.amount,
            category: this.category,
            description: this.description,
            userId:id
        },options);
    }
    static deleteExpense(ID,id,options) {
        console.log(ID,id);
        return Expense.destroy({
            where: {
                id: ID, userId:id
            }
        },options);
    }
    static findAllExpenses(id, offset, limit) {
        return Expense.findAll({
          where: { userId: id },
          offset: offset,
          limit: limit,
          order: [['createdAt', 'DESC']]
        });
      }
}
module.exports={Expense,ExpenseModel};