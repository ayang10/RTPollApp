const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '469628',
    key: '1841ebae5e98ee1c30da',
    secret: '2cc152180f83ba0e5dc6',
    cluster: 'us2',
    encrypted: true
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, 
        votes: votes}));
}); //this  mean /poll

router.post('/', (req, res) => {
    const newVote = {
        pl: req.body.pl,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('pl-poll', 'pl-vote', {
            points: parseInt(vote.points),
            pl: vote.pl
          });
    
          return res.json({success: true, message: 'Thank you for voting.'});
    });
    
});

module.exports = router;