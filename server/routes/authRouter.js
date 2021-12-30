const express = require('express');
require("dotenv").config();
const authRouter = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const {
    JWT_SECRET
} = process.env

// Signup
authRouter.post("/signup", (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if(err){
        res.status(500)
        return next(new Error('Something went wrong'))
        }
        if(user){
        res.status(403)
        return next(new Error("That username is already taken"))
        }
        const newUser = new User(req.body)
        newUser.save((err, savedUser) => {
        if(err){
            res.status(500)
            return next(new Error('Something went wrong'))
        }
                                // payload,            // secret
        const token = jwt.sign(savedUser.withoutPassword(), JWT_SECRET)
        return res.status(201).send({ token, user: savedUser.withoutPassword() })
        })
    })
});

// Login
authRouter.post("/login", (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if(err){
        res.status(500)
        return next(new Error("Something went wrong, please try again"))
        }
        if(!user){
        res.status(403)
        return next(new Error("User not found"))
        }
        user.checkPassword(req.body.password, (err, isMatch) => {
        if(err){
            res.status(403)
            return next(new Error("Username or password are incorrect"))
        }
        if(!isMatch){
            res.status(403)
            return next(new Error("Username or password are incorrect"))
        }
        const token = jwt.sign(user.withoutPassword(), JWT_SECRET)
        return res.status(200).send({ token, user: user.withoutPassword() })
        })
    })
});

module.exports = authRouter