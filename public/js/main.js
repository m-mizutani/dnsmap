$(document).ready(function() {
  $('#fileupload').fileupload({
    progressall: function (e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      if (progress < 100) {
        $('#status').text('Uploading ' + progress + '%');
      } else {
        $('#status').text('Processing...');
      }
    },
    done: function(e, data) {
      var r = data.result;
      console.log(r);
      if (r.msg === 'OK') {
        $('#status').empty();
        $('#status').append('<div>Completed</div>' +
                            '<div class="thumb">' + 
                            '<a href="' + data.result.url + '" target="_blank">' + 
                            '<img src="' + r.thumb + '" />' +
                            '</div>' +
                            '</a>');
      } else {
        $('#status').text('Error, ' + r.err);
      }
    },
  });

  function show_content(c_id) {
    $('ul.nav li').removeClass('active');
    $('div.content').addClass('hidden');
    $('ul.nav li#' + c_id).addClass('active');
    $('div.content#' + c_id).removeClass('hidden');
  }
  var menu = ['home', 'about', 'example'];
  menu.forEach(function(m) {
    $('li#' + m).click(function() {
      show_content(m);
    });
  });

  /*
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
*/
});
