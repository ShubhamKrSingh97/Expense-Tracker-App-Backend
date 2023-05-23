const express=require('express');
const router=express.Router();
const authenticate=require('../middlewares/authenticate');
const deleteExpenseController=require('../controllers/delete-expense-controller');

module.exports=router.delete('/delete-expense/:id',authenticate, deleteExpenseController);