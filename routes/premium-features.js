const express=require('express');
const router=express.Router();
const premiumFeaturesController=require('../controllers/premium-features-controller');
const authenticate=require('../middlewares/authenticate');
router.get('/rankings',authenticate,premiumFeaturesController);

module.exports=router;