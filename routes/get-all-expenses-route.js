const express=require('express');
const router=express.Router();
const getAllExpensesController=require('../controllers/get-all-expenses-controller');
const authenticate=require('../middlewares/authenticate');

module.exports=router.get('/get-all-expenses',authenticate, getAllExpensesController);