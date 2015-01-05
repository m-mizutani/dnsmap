var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var spawn = require('child_process').spawn;
var path = require('path');

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

  var filesize_limit = 100 * 1000 * 1000;
  if (size > filesize_limit) {
    res.writeHead(403, {'content-type': 'text/html'});
    res.end('A file over 10MB is not allowed');
    return;
  }
  
  form.parse(req, function(err, fields, files) {
    var f = files.pcap;
    console.log(f);

    var old_path = './' + f._writeStream.path;
    var fname = path.basename(f._writeStream.path);
    var script = '/Users/mizutani/works/dvrtools/bin/dnsmap';
    var dnsmap_proc = spawn(script, 
        ['-o', fname, '-l', 'fdp', '-a', '-r', old_path]);
        
    dnsmap_proc.stderr.on('data', function(data) {
      console.log('DNSMAP, stderr: ' + data);
    });
    dnsmap_proc.on('exit', function(code) {
      console.log('status: ' + code);
      var new_path = "/map/" + fname + ".png";
      fs.rename(fname + ".png", "./public/" + new_path, function(err) {
        if (err) throw err;
      });
            
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(JSON.stringify({msg: 'OK', url: new_path}));
    });    
  });
});
module.exports = router;
