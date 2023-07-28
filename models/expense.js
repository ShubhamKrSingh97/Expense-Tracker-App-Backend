const mongoose=require('mongoose');

const expenseSchema= new mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
const Expense= mongoose.model('Expense',expenseSchema);

module.exports=Expense;