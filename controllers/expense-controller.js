const Expense = require('../models/expense');
const User = require('../models/user');


const addExpense = async (req, res) => {
    let { amount, description, category } = req.body;
    try {
        let [exp, usr] = await Promise.all([Expense.create(
            { amount: amount, description: description, category: category, userId: req.user.id }
        ), User.findById(req.user.id)])
        let totalAmt = usr.totalExpense + Number(amount);
        await User.updateOne({ _id: usr.id }, { totalExpense: totalAmt });
        return res.status(202).json({
            success: true, expense: exp
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}

const deleteExpense = async (req, res) => {
    try {
        let amt = await Expense.findOne( { _id: req.params.id  });
        let rowsDeleted = await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
        if (rowsDeleted == 0) {
            return res.status(500).json({ message: "Expense does not belong to the user" });
        }
        else {
            let usr = await User.findById(req.user.id);
            let totalAmt = usr.totalExpense - Number(amt.amount);
            await User.updateOne({ _id: req.user.id }, { totalExpense: totalAmt });
        }
        res.status(202).end();
    } catch (err) {
        return res.status(404).json({
            message: "No such expenses found"
        });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (currentPage - 1) * limit;
        const userId = req.user.id;
        const [exp, total] = await Promise.all([
            Expense.find({ userId }).skip(offset).limit(limit),
            Expense.countDocuments({ userId }),
          ]);
        const nextPage = currentPage + 1;
        const prevPage = currentPage - 1;
        var hasPrev = prevPage > 0;
        var hasNext = nextPage <= Math.ceil(total / limit);
        return res.status(202).json({
            allexp: exp,
            hasPrev: hasPrev,
            hasNext: hasNext,
            currentPage: currentPage,
            nextPage: nextPage,
            prevPage: prevPage,
            limit: limit
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal issue.Try again later"
        });
    }

}


module.exports = { addExpense, deleteExpense, getAllExpenses };