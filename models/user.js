const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const Joi = require('joi');

// var config = require('config');

// const myPassword = "Ma8hgjtSnozz";

let userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is wrong");
            }
        }
    },
    password: { type: String, required: true },
    biz: { type: Boolean, required: true },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    cards: Array
},
    {
        methods: {
            async checkPassword(password) {
                return await bcrypt.compare(password, this.password);
            },
            getToken() {
                return jwt.sign({id: this._id, biz:this.biz},process.env.JWT_PASSWORD);
            }
        }
    });



const User = mongoose.model("User", userSchema);


function validateUser(user) {

    const schema = Joi.object({
      name: Joi.string().min(2).max(255).required(),
      email: Joi.string().min(6).max(255).required().email(),
      password: Joi.string().min(6).max(1024).required(),
      biz: Joi.boolean().required()
    });
  
    return schema.validate(user);
  }
  
  function validateCards(data) {
  
    const schema = Joi.object({
      cards: Joi.array().min(1).required()
    });
  
    return schema.validate(data);
  }
  
  exports.User = User;
  exports.validate = validateUser;
  exports.validateCards = validateCards;



