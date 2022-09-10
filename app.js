require('dotenv').config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
// const chalk = require('chalk');
const morgan = require('morgan');
app.use(morgan('tiny'));
app.use(express.json());
const user = require('./routes/user');
// const auth = require('./routes/auth');
const cards = require('./routes/cards');
const users = require('./routes/users');

require('./databases/mongoDB');
var cors = require('cors');
app.use(cors());
const chechConnection = require("./middleware/checkConnection");
app.use(chechConnection);
app.use('/user', user);
// app.use('/auth', auth);
app.use('/cards', cards);
app.use('/users', users);
// app.use(morgan('combined'))
app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});