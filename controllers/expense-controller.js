const { ExpenseModel , Expense } = require('../models/expense');
const {UserModel}=require('../models/user');
const {sequelize}=require('../util/database');


const addExpense = async (req, res) => {
    const transactions=await sequelize.transaction();
    let { amount, description, category } = req.body;
    let obj = new ExpenseModel(category, amount, description);
    try {
        let[exp,usr]=await Promise.all([obj.addExpense(req.user.id,{transactions}),UserModel.findUser(req.user.id,{transactions})])
        let totalAmt=usr.TotalExpense+Number(amount);
        await UserModel.updateTotalExp(usr.dataValues.id,totalAmt,{transactions});
        await transactions.commit();
        return res.status(202).json({
            success: true, expense: exp
        });
    } catch (err) {
        await transactions.rollback();
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}

const deleteExpense = async (req, res) => {
    const transactions = await sequelize.transaction();
    try {
        let amt = await Expense.findOne({ where: { id: req.params.id } });
        let rowsDeleted = await ExpenseModel.deleteExpense(req.params.id, req.user.id, { transactions });
        if (rowsDeleted == 0) {
            return res.status(500).json({ message: "Expense does not belong to the user" });
        }
        else {
            let usr = await UserModel.findUser(req.user.id);
            let totalAmt = usr.TotalExpense - Number(amt.amount);
            await UserModel.updateTotalExp(usr.id, totalAmt, { transactions });
        }
        await transactions.commit();
        res.status(202).end();
    } catch (err) {
        await transactions.rollback();
        return res.status(404).json({
            message: "No such expenses found"
        });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        let exp = await ExpenseModel.findAllExpenses(req.user.id);
        return res.status(202).json(exp);
    } catch (err) {
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}


module.exports={addExpense,deleteExpense,getAllExpenses};