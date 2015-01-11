var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var spawn = require('child_process').spawn;
var path = require('path');
var easyimg = require('easyimage');
var logger = require('fluent-logger')

var settings;
router.configure = function(opt) {
  settings = opt;
  logger.configure('dnsmap', {
    host: opt.dnsmap.fluentd.host,  
    port: opt.dnsmap.fluentd.port,
    timeout: 3.0
  });
};

router.get('/', function(req, res) {
  res.render('dnsmap', { title: 'Express' });
  console.log(settings);
});
router.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = "./uploads"
  var log = {
    addr: req._remoteAddress,
    header: req.headers
  };

  var size = parseInt(req.headers['content-length']);

  var filesize_limit = 100 * 1000 * 1000;
  if (size > filesize_limit) {
    res.writeHead(200, {'content-type': 'application/json'});
    var msg = {msg: 'NG', err: 'A file over 10MB is not allowed'}
    log.res = msg;
    logger.emit('fail', log);
    res.end(JSON.stringify(msg));
    return;
  }
  
  form.parse(req, function(err, fields, files) {
    var f = files.pcap;
    var old_path = './' + f._writeStream.path;
    var fname = path.basename(f._writeStream.path);
    var script = settings.dnsmap.script_path;
    var args = ['-o', fname, '-l', 'fdp', '-a', '-r', old_path];
    console.log(script + ' ' + args.join(' '));
    try {
      // Start conversion
      var dnsmap_proc = spawn(script, args);      
      dnsmap_proc.stderr.on('data', function(data) {
        console.log('DNSMAP, stderr: ' + data);
      });
      dnsmap_proc.on('exit', function(code) {
        console.log('status: ' + code);
        var old_local_path = fname + '.png';
        var dot_path = fname + '.dot';
        var new_path = "/map/" + fname + ".png";
        var new_local_path = "./public/" + new_path;
        var thumb_path = '/thumb/' + fname + '.png';
        var thumb_local_path = './public/' + thumb_path;

        fs.rename(old_local_path, new_local_path, function(err) {
          if (err) { throw err; }
          else {
            // Create thumbnail
            easyimg.thumbnail({
              src: new_local_path,
              dst: thumb_local_path,
              width: 300
            }).then(function(image) {
              console.log(image);
              res.writeHead(200, {'content-type': 'application/json'});
              var msg = {msg: 'OK', url: new_path, thumb: thumb_path};
              log.msg = msg;
              logger.emit('complete', log);
              res.end(JSON.stringify(msg));
            }, function(err) {
            });
          }
        });
        fs.unlink(dot_path, function(err) {
          if (err) throw err;
        });

      });    
    } catch (e) {
      console.log('-- exception --');
      console.log(e);
      log.ex = e;
      logger.emit('exception', log);
    }
  });
});
module.exports = router;
