const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const File = require('../models/File');
const {
  openSharedFile,
  requestAccess,
  approveAccess,
} = require('../controllers/shareController');

router.get('/open/:fileId', auth, openSharedFile);
router.post('/request-access', auth, requestAccess);
router.post('/approve-access', auth, approveAccess);

router.get('/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found' });
  res.json(file);
});

module.exports = router;
