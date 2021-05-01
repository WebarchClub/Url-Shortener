const express = require('express');
const router = express.Router();

const {
  getShortUrls,
  createShortUrl,
  redirectShortUrl,
} = require('../controllers/urlController');

router.route('/').get(getShortUrls).post(createShortUrl);
router.get('/:shortid', redirectShortUrl);

module.exports = router;
