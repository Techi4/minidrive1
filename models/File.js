const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('File', fileSchema);
