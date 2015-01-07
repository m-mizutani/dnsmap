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
