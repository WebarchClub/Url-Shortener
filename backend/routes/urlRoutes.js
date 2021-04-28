const express = require('express');
const router = express.Router();

const {
  getShortUrls,
  createShortUrl,
} = require('../controllers/urlController');

router.route('/').get(getShortUrls).post(createShortUrl);

module.exports = router;
