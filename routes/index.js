var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var spawn = require('child_process').spawn;
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/dnsmap');
});
module.exports = router;
