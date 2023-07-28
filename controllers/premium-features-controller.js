const User=require('../models/user');
const Expense=require('../models/expense');
const { uploadtoS3 } = require('../services/AWS');
require('dotenv').config();

const leaderBoard=async (req,res)=>{
    try{
        const allUser=await User.find();
        res.status(202).json({allUser});
    }catch(err){
        res.status(500).json({message:'Internal issue'});
    };
   
}

const monthlyReport=async(req,res)=>{
    try{
        const month=req.header('month');
        console.log(month);
        const startDate=new Date();
        const currentYear = new Date().getFullYear();
        startDate.setFullYear(currentYear);
        startDate.setMonth(month,1);
        const endDate=new Date(startDate);
        endDate.setMonth(startDate.getMonth()+1,0);
        const allExpenses = await Expense.find({
            userId: req.user.id,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          });
        return res.status(202).json({allExpenses:allExpenses});
    }catch(err){
        console.log(err);
        return res.status(400).json({message:'Something went wrong'});
    }
}

const yearlyReport = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear}-01-01`);
      const endDate = new Date(`${currentYear}-12-31`);
  
      const allExpenses = await Expense.find({
        userId: req.user.id,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
  
      const monthlyExpenses = {};
      allExpenses.forEach((expense) => {
        const month = expense.createdAt.getMonth() + 1; 
        const amount = expense.amount;
  
        if (!monthlyExpenses[month]) {
          monthlyExpenses[month] = amount;
        } else {
          monthlyExpenses[month] += amount;
        }
      });
      const yearlyReportData = Object.keys(monthlyExpenses).map((month) => ({
        month: parseInt(month),
        totalExpense: monthlyExpenses[month],
      }));
      res.status(202).json({ allExpenses: yearlyReportData });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Something went wrong' });
    }
  };
  
  
  

const downloadReport=async(req,res)=>{
    try{
        const allExpenses=await Expense.find({_id:req.user.id},'amount category description createdAt');
        const stringifiedExpenses=JSON.stringify(allExpenses);
        const filename=`Expenses/${req.user.id}/${new Date()}.text`;
        const fileURL=await uploadtoS3(stringifiedExpenses,filename);
        res.status(202).json({message:fileURL})
    }catch(err){
        console.log(err);
        return res.status(500).send({message:'Something went wrong'});
    }

}


module.exports={leaderBoard,monthlyReport,yearlyReport,downloadReport};