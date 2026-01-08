const File = require('../models/File');
const AccessRequest = require('../models/AccessRequest');

exports.openSharedFile = async (req, res) => {
  const file = await File.findById(req.params.fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });

  // If owner
  if (file.owner.equals(req.user.id)) {
    return res.json({ access: 'owner', file });
  }

  // Check shared access
  const shared = file.sharedWith.find(
    s => s.user.toString() === req.user.id
  );

  if (shared) {
    return res.json({ access: shared.permission, file });
  }

  // Check pending request
  const request = await AccessRequest.findOne({
    file: file._id,
    requester: req.user.id,
  });

  if (request) {
    return res.json({ access: 'pending' });
  }

  return res.json({ access: 'request' });
};
exports.requestAccess = async (req, res) => {
  const { fileId } = req.body;

  await AccessRequest.create({
    file: fileId,
    requester: req.user.id,
  });

  res.json({ message: 'Access request sent' });
};
exports.approveAccess = async (req, res) => {
  const { requestId, permission } = req.body;

  const request = await AccessRequest.findById(requestId).populate('file');
  if (!request) return res.status(404).json({ message: 'Request not found' });

  if (request.file.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  request.status = 'approved';
  request.permission = permission;
  await request.save();

  request.file.sharedWith.push({
    user: request.requester,
    permission,
  });

  await request.file.save();

  res.json({ message: 'Access granted' });
};
