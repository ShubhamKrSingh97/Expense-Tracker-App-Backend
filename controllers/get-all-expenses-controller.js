const { ExpenseModel } = require('../models/expense');

module.exports = async (req, res) => {
    try {
        let exp = await ExpenseModel.findAllExpenses(req.user.id);
        return res.status(202).json(exp);
    } catch (err) {
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}