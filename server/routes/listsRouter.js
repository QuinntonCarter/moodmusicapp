const express = require('express');
const listsRouter = express.Router();
const List = require('../models/list.js');

// GET users' recent or all user's friends' lists
listsRouter.get('/', (req, res, next) => {
    if(req.query.type === 'friends'){
        List.find({ cueUser: { $in: req.query.friends }},
            (err, friendMood) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(200).send(friendMood)
    })} else if(req.query.type === 'user') {
        // query current user's recent posts
        List.find({ cueUser: req.user._id },
            { isAdmin: 0, password: 0 },
            (err, friends) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(friends)
            })
    }
});

// POST your list to the db: overwrites previous posted list if found; if not just posts list to db
listsRouter.post(`/`, (req, res, next) => {
    req.body.cueUser = req.user._id
    req.body.userString = req.user.username
    const newList = new List(req.body)
    List.findOne({ cueUser: req.user._id },
        (err, found) => {
            if(err){
                res.status(500)
                return next(err)
            }
            if(found){
            return List.findByIdAndDelete(found._id, 
                (err, found) => {
                    if(err){
                        res.status(500).send(`Error deleting ${found._id}`)
                        return next(err)
                    }
                    return newList.save((err, list) => {
                        if(err){
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send(list)
                    })
                })
        } else {
            // else if no post, create post
            newList.save((err, list) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(list)
            })
        }
    })
});

module.exports = listsRouter