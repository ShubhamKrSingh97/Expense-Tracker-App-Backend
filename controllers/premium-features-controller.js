const{UserModel}=require('../models/user');

module.exports=async (req,res)=>{
    try{
        const allUser=await UserModel.getAllUsers();
        res.status(202).json({allUser});
    }catch(err){
        res.status(500).json({message:'Internal issue'});
    };
   
}