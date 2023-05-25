const express=require('express');
const router=express.Router();
const authenticate=require('../middlewares/authenticate');
const purchasePremiumController=require('../controllers/purchase-premium-controller');
module.exports=router.get('/buy-premium',authenticate,purchasePremiumController.prePayment);
module.exports=router.post('/update-transaction',authenticate,purchasePremiumController.postPayment);


