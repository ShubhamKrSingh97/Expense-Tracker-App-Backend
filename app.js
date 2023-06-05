const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const addUserRoute = require('./routes/add-user-route');
const userLoginRoute=require('./routes/user-login-route');
const addExpenseRoute=require('./routes/add-expense-route');
const getAllExpensesRoute=require('./routes/get-all-expenses-route');
const deleteExpenseRoute=require('./routes/delete-expense-route');
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

app.use(addUserRoute);
app.use(userLoginRoute);
app.use(addExpenseRoute);
app.use(getAllExpensesRoute);
app.use(deleteExpenseRoute);
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

app.use(forgotPassRoute);


sequelize.sync().then(result => {
    app.listen('4000');
});