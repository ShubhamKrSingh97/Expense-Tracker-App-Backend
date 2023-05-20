const express=require('express');
const router=express.Router();
const userLoginController=require('../controllers/user-login-controller');

module.exports=router.post('/user-login',userLoginController);