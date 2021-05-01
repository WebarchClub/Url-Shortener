const express = require('express');
const router = express.Router();

const {
  getShortUrls,
  createShortUrl,
  redirectShortUrl,
} = require('../controllers/urlController');

router.get('/', getShortUrls);
router.post('/', createShortUrl);
router.get('/:shortid', redirectShortUrl);

module.exports = router;
