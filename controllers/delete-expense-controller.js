const { ExpenseModel,Expense } = require('../models/expense');
const {UserModel}=require('../models/user');
const sequelize = require('../util/database');
module.exports = async (req, res) => {
    const transactions =await sequelize.transaction();
    try {
        let amt=await Expense.findOne({where:{id:req.params.id}});
        let rowsDeleted = await ExpenseModel.deleteExpense(req.params.id, req.user.id,{transactions});
        if (rowsDeleted == 0) {
            return res.status(500).json({ message: "Expense does not belong to the user" });
        }
        else{
            let usr=await UserModel.findUser(req.user.id,{transactions});
            let totalAmt=usr.TotalExpense-Number(amt.amount);
            await UserModel.updateTotalExp(usr.id,totalAmt,{transactions});
        }
    } catch (err) {
        await transactions.rollback();
        return res.status(404).json({
            message: "No such expenses found"
        });
    }
}