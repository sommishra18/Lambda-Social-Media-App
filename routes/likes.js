const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likeController');

router.post('/toggle' , likesController.toggleLike);

module.exports = router;