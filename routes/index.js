const express = require('express');
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");

// post router
router.use(expressLayouts)

router.get('/', (req, res) => res.render('welcome'))

module.exports = router;
