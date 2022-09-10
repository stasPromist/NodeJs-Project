const jwt = require("jsonwebtoken");
const {User} = require('../models/user');
// const config = require("config");

// require('dotenv').config();
module.exports = async(req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access...");
    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        if (!decoded || !("id" in decoded)) {
            // if (!decoded || !decoded) {
            return res.status(401).send("Invalid token or expired")
        };
        req.user_id = decoded.id;
        let user = await User.findById(req.user_id);
        req.user = user;
        // let admim = await User.findById(req.user_id);
        // req.admim = admim;
        // req.biz = decoded.biz;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token");
    }
}