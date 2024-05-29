const express = require('express');
const { createText, getAllTexts, updateText, deleteText } = require('../controllers/textController');
const authenticateJWT = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../utils/multer');
const router = express.Router();

router.post('/', authenticateJWT, authorize(['seller']), upload.single('file'), createText);
router.get('/', authenticateJWT, getAllTexts);
router.put('/:id', authenticateJWT, authorize(['seller']), updateText);
router.delete('/:id', authenticateJWT, authorize(['seller']), deleteText);

module.exports = router;
