const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {sequelize} = require('./util/database');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const userRoute = require('./routes/user-route');
const expenseRoute=require('./routes/expense-route');

const purchasePremiumRoute=require('./routes/purchase-premium-route');
const premiumFeaturesRoute=require('./routes/premium-features');
const forgotPassRoute=require('./routes/forgot-pass-route');
app.use(cors());
app.use(bodyParser.json({ encoded: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'signup-login.html'), 'utf-8', (err, data) => {
        res.send(data);
    })
});


app.get('/expense-tracker',(req,res)=>{
    fs.readFile(path.join(__dirname, 'views', 'expense.html'), 'utf-8', (err, data) => {
        res.send(data);
    });
});

app.use(userRoute);

app.use(expenseRoute);

app.use(purchasePremiumRoute);

app.get('/premium/leaderboard',(req,res)=>{
        res.sendFile(path.join(__dirname, 'views', 'leaderboard.html'));

});

app.use('/premium',premiumFeaturesRoute);

app.get('/update-password', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'updatePass.html'), 'utf-8', (err, data) => {
        res.send(data);
    })
});
app.get('/premium/reports',(req,res)=>{
    fs.readFile(path.join(__dirname,'views','expenseReport.html'),'utf-8',(err,data)=>{
        res.send(data);
    })
})
app.use(forgotPassRoute);


sequelize.sync().then(result => {
    app.listen('4000');
});