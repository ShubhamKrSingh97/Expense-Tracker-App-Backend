const express=require('express');
const router=express.Router();
const forgotPassController=require('../controllers/forgot-pass-controller');
router.post('/password/forgot-password',forgotPassController.forgotPass);
router.post('/password/update-password',forgotPassController.updatePass);
module.exports=router;