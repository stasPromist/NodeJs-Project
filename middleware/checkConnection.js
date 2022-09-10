const mongoose = require("mongoose");

module.exports = (req, res, next) => {
    console.log(mongoose.connection.readyState)
    if((mongoose.connection.readyState) !== 1) {
        res.status(500).send('Cant connect toDataBase');
        return;
    }
    next();
       
    }
