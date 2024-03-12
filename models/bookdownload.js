
const mongoose = require('mongoose');

const bookDownloadSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
  downloadedAt: {
    type: Date,
    default: Date.now,
  },
});

const BookDownload = mongoose.model('BookDownload', bookDownloadSchema)

module.exports = BookDownload
