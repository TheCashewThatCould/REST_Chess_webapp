const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.route('')
    .get(chatController.getAllChat)
    .post(chatController.createNewMessage)
    
router.route('/:id')
    .get(chatController.getAllUser);

module.exports = router;