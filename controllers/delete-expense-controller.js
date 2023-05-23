const { ExpenseModel } = require('../models/expense');

module.exports = async (req, res) => {
    try {
        let rowsDeleted = await ExpenseModel.deleteExpense(req.params.id, req.user.id);
        if (rowsDeleted == 0) {
            return res.status(500).json({ message: "Expense does not belong to the user" });
        }
    } catch (err) {
        return res.status(404).json({
            message: "No such expenses found"
        });
    }
}