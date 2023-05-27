const { ExpenseModel } = require('../models/expense');
const {UserModel}=require('../models/user');
module.exports = async (req, res) => {
    let { amount, description, category } = req.body;
    let obj = new ExpenseModel(category, amount, description);
    try {
        let exp = obj.addExpense(req.user.id);
        let usr=UserModel.findUser(req.user.id);
        let totalAmt=usr.TotalExpense+Number(amount);
        await UserModel.updateTotalExp(usr.dataValues.id,totalAmt);
        return res.status(202).json({
            success: true, expense: exp
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}