const{UserModel}=require('../models/user');
const{Expense,ExpenseModel}=require('../models/expense');
const {Op, sequelize}=require('../util/database');
const { uploadtoS3 } = require('../services/AWS');
require('dotenv').config();

const leaderBoard=async (req,res)=>{
    try{
        const allUser=await UserModel.getAllUsers();
        res.status(202).json({allUser});
    }catch(err){
        res.status(500).json({message:'Internal issue'});
    };
   
}

const monthlyReport=async(req,res)=>{
    try{
        const month=req.header('month');
        const startDate=new Date();
        const currentYear = new Date().getFullYear();
        startDate.setFullYear(currentYear);
        startDate.setMonth(month,1);
        const endDate=new Date(startDate);
        endDate.setMonth(startDate.getMonth()+1,0);
        const allExpenses=await Expense.findAll({
            where:{
                userId:req.user.id,
                createdAt:{
                    [Op.between]:[startDate,endDate]
                }
            }
        })
        return res.status(202).json({allExpenses:allExpenses});
    }catch(err){
        console.log(err);
        return res.status(400).json({message:'Something went wrong'});
    }
}

const yearlyReport=async(req,res)=>{
    try{
        const currentYear=new Date().getFullYear();
        const allExpenses=await Expense.findAll({
            attributes:[[sequelize.fn('MONTH',sequelize.col('createdAt')),'month'],[sequelize.fn('SUM',sequelize.col('amount')),'totalExpense']],
            where:{
                userId:req.user.id,
                createdAt:{[Op.between]:[new Date(`${currentYear}-01-01`),new Date(`${currentYear}-12-31`)]},
            },
        group:sequelize.fn('MONTH',sequelize.col('createdAt'))
        });
        res.status(202).json({allExpenses:allExpenses})
    }catch(err){
        console.log(err);
        return res.status(400).json({message:'Something went wrong'});
    }
}

const downloadReport=async(req,res)=>{
    try{
        const allExpenses=await ExpenseModel.findAllExpenses(req.user.id);
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