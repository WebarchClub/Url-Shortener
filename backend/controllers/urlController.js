const { response } = require('express');
const Url = require('../models/Url');

// @desc Get all short URLS
// @route GET api/v1/shortUrl
// Public
exports.getShortUrls = async (req, res) => {
  try {
    const shortUrls = await Url.find();

    res.status(200).json({
      success: true,
      data: shortUrls,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error message : ${error.message}`,
    });
  }
};

// @desc Create a short URL
// @route POST api/v1/shortUrl
// Public
exports.createShortUrl = async (req, res) => {
  try {
    const inputUrl = req.body;

    const shortUrl = await Url.create(inputUrl);

    res.status(201).json({
      success: true,
      url: shortUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error message: ${error.message}`,
    });
  }
};
