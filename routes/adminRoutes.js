const router = require('express').Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  getAllFiles,
  deleteAnyFile,
} = require('../controllers/adminController');

router.get('/files', auth, isAdmin, getAllFiles);
router.delete('/files/:id', auth, isAdmin, deleteAnyFile);

module.exports = router;
