const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const addUserRoute = require('./routes/add-user-route');
const userLoginRoute=require('./routes/user-login-route');
app.use(cors());
app.use(bodyParser.json({ encoded: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'signup-login.html'), 'utf-8', (err, data) => {
        res.send(data);
    })
})

app.use(addUserRoute);
app.use(userLoginRoute);


sequelize.sync().then(result => {
    app.listen('4000');
});
