const express=require('express');
const router=express.Router();
const authenticate=require('../middlewares/authenticate');
const expenseController=require('../controllers/expense-controller');

router.post('/add-expense',authenticate, expenseController.addExpense);
router.delete('/delete-expense/:id',authenticate,expenseController.deleteExpense);
router.get('/get-all-expenses',authenticate,expenseController.getAllExpenses);

module.exports=router;