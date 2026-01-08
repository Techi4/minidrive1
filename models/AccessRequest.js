const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  permission: {
    type: String,
    enum: ['view', 'edit'],
    default: 'view',
  },
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
