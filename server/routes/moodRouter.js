const express = require('express');
const moodRouter = express.Router();
const MoodList = require('../models/moodList.js');

// GET users' recent and all user's friends' recent moods
moodRouter.get('/', (req, res, next) => {
    if(req.query.type === 'friends'){
        MoodList.find({ cueUser: { $in: req.query.friends }},
            (err, friendMood) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(200).send(friendMood)
        })
    } else if(req.query.type === 'user') {
        // query current user's recent posts
        MoodList.find({ cueUser: req.user._id },
            { isAdmin: 0, password: 0 },
            (err, user) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(user)
        })
    } else if (req.query.type === 'searched'){
        MoodList.find({ cueUser: req.query.searched },
            { isAdmin: 0, password: 0},
            (err, user) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(user)
            })
    }
});

// POST new mood and overwrite previous
moodRouter.post('/:time', (req, res, next) => {
    const newMood = new MoodList({ items: req.body, timeline: req.params.time, cueUser: req.user._id, userString: req.user.username })
    MoodList.findOne({ cueUser: req.user._id },
        (err, found) => {
            if(err){
                res.status(500)
                return next(err)
            }
            if(found){
            return MoodList.findByIdAndDelete(found._id, 
                (err, found) => {
                    if(err){
                        res.status(500).send(`Error deleting ${found._id}`)
                        return next(err)
                    }
                    return newMood.save((err, mood) => {
                        if(err){
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send(mood)
                    })
                })
        } else {
            // else if no post, create post
            newMood.save((err, mood) => {
                if(err){
                    res.status(500)
                    return next(err)
                }
                return res.status(201).send(mood)
            })
        }
    })
});

module.exports = moodRouter