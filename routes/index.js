const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

console.log('Router loaded');

router.get('/', homeController.home);
router.use('/users',require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/api', require('./api'));
router.use('/friends', require('./friends'));

module.exports = router;