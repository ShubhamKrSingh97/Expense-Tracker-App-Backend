const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// const Expense=require('./models/expense');
const addUserRoute = require('./routes/add-user-route');
const userLoginRoute=require('./routes/user-login-route');
const addExpenseRoute=require('./routes/add-expense-route');
const getAllExpensesRoute=require('./routes/get-all-expenses-route');
const deleteExpenseRoute=require('./routes/delete-expense-route');
const purchasePremiumRoute=require('./routes/purchase-premium-route');
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

sequelize.sync().then(result => {
    app.listen('4000');
});