const express = require('express');
const router = express.Router();
const chessController = require('../controllers/chessController');

router.route('')
    .get(chessController.joinMatch)
    .post(chessController.makeMove)
router.route('/board')
    .get(chessController.getBoard)
    .post(chessController.reqEndGame)
module.exports = router;