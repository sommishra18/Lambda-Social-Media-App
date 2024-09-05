const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends_controller');
const passport = require('passport');

router.get('/add-friend' , passport.checkAuthentication ,friendsController.addFriend);

module.exports = router;