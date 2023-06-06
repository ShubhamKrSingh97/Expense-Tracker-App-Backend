const { ExpenseModel } = require('../models/expense');
const {UserModel}=require('../models/user');
const {sequelize}=require('../util/database');


module.exports = async (req, res) => {
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