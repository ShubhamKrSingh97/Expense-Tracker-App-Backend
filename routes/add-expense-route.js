const express=require('express');
const router=express.Router();
const authenticate=require('../middlewares/authenticate');
const addExpenseController=require('../controllers/add-expense-controller');

module.exports=router.post('/add-expense',authenticate, addExpenseController);