const express=require('express');
const router=express.Router();
const premiumFeaturesController=require('../controllers/premium-features-controller');
const authenticate=require('../middlewares/authenticate');
router.get('/rankings',authenticate,premiumFeaturesController.leaderBoard);
router.get('/reports/monthly',authenticate,premiumFeaturesController.monthlyReport);
router.get('/reports/yearly',authenticate,premiumFeaturesController.yearlyReport);
module.exports=router;