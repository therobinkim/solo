
var headers = {
  'access-control-allow-methods': 'GET, POST',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'text/html'
};

exports.handleRequest = function(req, res) {
  var statusCode;
  var urls = {
    '/index.html': true,
    '/input.html': true,
    '/view.html': true
  };
  var methods = {
    'GET': function() {
      console.log(req.url);
      res.writeHead(200, headers);
      if( urls[req.url] ) {
        res.write(req.url);
      } else {
        res.write('hi');
      }
      res.end();
    },
    'POST': function() {
      // aggregate all chunks
      // parse data into database!
    }
  };
  methods[req.method]();
};

var showPage = function(url) {
  
};
