const express = require('express');
const multer = require('multer');
const textController = require('../controllers/textController');
const { authenticateJWT, authorize } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authenticateJWT, authorize(['seller']), upload.single('file'), textController.createText);
router.get('/', authenticateJWT, textController.getTexts);
router.put('/:id', authenticateJWT, authorize(['seller']), textController.updateText);
router.delete('/:id', authenticateJWT, authorize(['seller']), textController.deleteText);

module.exports = router;
