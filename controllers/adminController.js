const File = require('../models/File');
const fs = require('fs');
const path = require('path');

/* GET all files (admin only) */
exports.getAllFiles = async (req, res) => {
  const files = await File.find().populate('owner', 'email name');
  res.json(files);
};

/* DELETE any file (admin only) */
exports.deleteAnyFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // delete file from disk
  const filePath = path.join(__dirname, '..', file.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await file.deleteOne();
  res.json({ message: 'File deleted by admin' });
};
