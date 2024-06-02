const mongoose = require('mongoose');

// Define your schema
const YourSchema = new mongoose.Schema({
  // Your schema fields
  createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL index set to expire after 24 hours (86400 seconds)
});

// Define the pre-remove middleware
YourSchema.pre('remove', async function(next) {
  try {
    // Access the deleted document
    const deletedDoc = this;

    // Perform any actions you want with the deleted document
    // For example, move it to an archive collection
    // const ArchiveModel = mongoose.model('Archive', ArchiveSchema);
    // await ArchiveModel.create(deletedDoc.toObject());

    next(); // Call next() to move on to the document removal process
  } catch (error) {
    next(error); // Pass any errors to the next middleware/error handling
  }
});

// Create your model
const YourModel = mongoose.model('YourModel', YourSchema);

module.exports = YourModel;