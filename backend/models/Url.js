const mongoose = require('mongoose');
const shortid = require('shortid');

const UrlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortid.generate,
    unique: true,
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Url', UrlSchema);
