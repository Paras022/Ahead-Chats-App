const express = require('express')
const {sendMesssage , allMessages} = require('../controllers/messageController')
const {protect} = require('../middlewares/authMiddleware')
const router = express.Router();

router.post('/',protect,sendMesssage)
router.get('/:chatId',protect,allMessages)

module.exports = router;