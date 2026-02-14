const express = require('express');
const router = express.Router();
const path = require('path');

// home route

router.get('/',
  async (req, res) => {
    res.render(path.join(__dirname, '../views/upload.ejs'));
      });

module.exports = router;