var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restApi")
.then( () => console.log('connect to MongoDB'))
.catch( err => console.log("error", err));

exports.modules = mongoose;