const express = require('express');
const router = express.Router();
const userSchema = require('../validations/user');
const { User } = require('../models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const _ = require("lodash");
const chalk = require("chalk");
router.post("/create", createRequest);

var jwt = require('jsonwebtoken');
const returnUserKeys = ['email','_id','name','biz','createdAt'];
const checkToken = require("./../middleware/checkToken")
async function createRequest(req, res) {
    const { error, value } = userSchema.newUser.validate(req.body);
    const user = value;
    if (error) {
        console.log(chalk.green(res.status(400).send(error)));
      
    }
    else {
        try {
            const result = await User.find({email: value.email});
            if (result.length > 0) {
                res.status(400).send("exist");
            }
            else {
                try {
                    const savedUser = await saveUser(user);
                    res.status(201).send(savedUser);
                } catch (err) {
                   res.status(400).send(err);

                }
            }
        }
        catch (err) {
            res.status(400).send(err);
        }
    }
}

function saveUser(user){
    return new Promise(async (resolve, reject) => {
        try {
            user.password = await bcrypt.hash(user.password, saltRounds);
            const savedUser = await new User(user).save();
            // resolve(savedUser);
            resolve(_.pick(savedUser,returnUserKeys));
       } catch (err) {
           console.log(reject (err));
       }
    })
    }

    router.post("/auth" ,login);

    async function login(req,res){
        const { error, value } = userSchema.auth.validate(req.body);
        const user = value;
        if (error) {
            res.status(400).send(error)
        }
        else{
            try{
                const userModel = await User.findOne({email:user.email});
                if (!userModel) { 
                    res.status(400).send("Username or password wrong");
                    return;
                }
                const isAuth = await userModel.checkPassword(user.password);
                if(!isAuth) {
                    res.status(400).send("Username or password wrong");
                    return;
                }
                res.status(200).send(userModel.getToken());
            } catch (err) {
                res.status(400).send(err)
            }
        }
    }

    router.post("/me", checkToken, me);

    router.get("/me", checkToken, me);
    async function me(req, res) {
        const userId = req.user_id;
        console.log(userId);
        try {
            const user = await User.findOne({_id:userId});
            res.status(200).send(_.pick(user,returnUserKeys));

        } catch (err) {
            res.status(400).send("User not exist, try to login again");
   
        }
    }
    


    const myPassword = "Ma8hgjtSnozz";
    var jwt = require('jsonwebtoken');


    router.post("/checkToken" ,(req, res) => {
        const example = {email: "example@example.com"};
        try {
           
                var token = jwt.sign({exp: Math.floor(Date.now() / 1000) ,data:example},  myPassword);
                res.status(200).send(token);
               
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
            return;
            
        }
    });



    router.post("/depcryptToken" ,(req, res) => {
        try {
            var decoded = jwt.verify(req.body.token,myPassword)
            res.status(200).send(decoded);

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
            return;
            
        }
    });


module.exports = router;