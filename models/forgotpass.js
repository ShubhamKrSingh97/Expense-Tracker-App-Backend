const mongoose=require('mongoose');

const forgotpassSchema= new mongoose.Schema({
    isActive:{
        type:Boolean
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
});

const ForgotPass=mongoose.model('forgotPassword',forgotpassSchema);
module.exports=ForgotPass;
