const File = require('../models/File');
const fs = require('fs');

exports.getFiles = async (req, res) => {
  const files = await File.find({ owner: req.user.id });
  res.json(files);
};

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });

  const file = await File.create({
    filename: req.file.originalname,
    path: req.file.path,
    owner: req.user.id,
  });

  res.json(file);
};

exports.deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'Not found' });

  fs.unlinkSync(file.path);
  await file.deleteOne();

  res.json({ message: 'Deleted' });
};
