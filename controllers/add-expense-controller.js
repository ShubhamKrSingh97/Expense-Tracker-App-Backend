const { ExpenseModel } = require('../models/expense');

module.exports = async (req, res) => {
    let { amount, description, category } = req.body;
    let obj = new ExpenseModel(category, amount, description);
    try {
        let exp = await obj.addExpense(req.user.id);
        return res.status(202).json({
            success: true, expense: exp
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}