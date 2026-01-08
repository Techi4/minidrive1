const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getFiles, uploadFile, deleteFile } = require('../controllers/fileController');

router.get('/', auth, getFiles);
router.post('/upload', auth, upload.single('file'), uploadFile);
router.delete('/:id', auth, deleteFile);

module.exports = router;
