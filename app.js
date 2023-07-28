const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose=require('mongoose');
const cors=require('cors');
app.use(cors());
//const helmet=require('helmet');

//app.use(helmet.contentSecurityPolicy({ directives: cspDirectives }));
require('dotenv').config();

const userRoute = require('./routes/user-route');
const expenseRoute=require('./routes/expense-route');
const purchasePremiumRoute=require('./routes/purchase-premium-route');
const premiumFeaturesRoute=require('./routes/premium-features');
const forgotPassRoute=require('./routes/forgot-pass-route');

app.use(bodyParser.json({ encoded: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoute);

app.use(expenseRoute);

app.use(purchasePremiumRoute);

app.use('/premium',premiumFeaturesRoute);

app.use(forgotPassRoute);


app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'signup-login.html'));
});


app.get('/expense-tracker',(req,res)=>{
        res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

app.get('/premium/leaderboard',(req,res)=>{
        res.sendFile(path.join(__dirname, 'views', 'leaderboard.html'));

});

app.get('/update-password', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'updatePass.html'));
});

app.get('/premium/reports',(req,res)=>{

        res.sendFile(path.join(__dirname,'views','expenseReport.html'));
});



mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(process.env.PORT || 4000);
}).catch((err)=>{
    console.log(err.message);
})