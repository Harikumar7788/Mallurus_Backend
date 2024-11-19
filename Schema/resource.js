const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  resumePath: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Reference to the Vendor model
  technologies: [String],
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
