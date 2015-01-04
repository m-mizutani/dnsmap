var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = "./uploads"
  console.log(req.headers);
  var size = parseInt(req.headers['content-length']);
  console.log(size);

  var filesize_limit = 10 * 1000 * 1000;
  if (size > filesize_limit) {
    res.writeHead(403, {'content-type': 'text/html'});
    res.end('A file over 10MB is not allowed');
    return;
  }
  
  form.parse(req, function(err, fields, files) {
    var f = files.pcap;
    console.log(f);

    var oldPath = './' + f._writeStream.path;
    var newPath = './uploads/' + f.name;
    fs.rename(oldPath, newPath, function(err) {
      if (err) throw err;
    });
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('OK');
  });
});
module.exports = router;
