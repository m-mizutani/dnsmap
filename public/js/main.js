$(document).ready(function() {
  $('#fileupload').fileupload({
    progressall: function (e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      console.log(progress);
    },
    done: function(e, data) {
      console.log(data.result);
      console.log('done!');
      $('#result').append('<div>' + 
                         '<a href="' + data.result.url + '">download</a>' +
                         '</div>');
    },
  });
  
  /*
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
*/
});
