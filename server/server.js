var express = require('express');
// var partials = require('express-partials');
var parser = require('./data-parser.js');

var app = express();

app.use(express.static(__dirname + '/../'));
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
// app.use(partials());
  // app.use(express.bodyParser());


app.get('/view', function(req, res) {
  res.render('view', {
    storage: JSON.stringify(parser.storage),
    whoa: [3, 2, 6],
    number: 9,
    sol: 'solution'
  });
  // res.sendFile('/view.html', {
  //   incidents: parser.storage,
  //   whoa: 3
  // });
});

app.get('/input', function(req, res) {
  res.render('input');
});

app.get('/data', function(req, res) {
  
});

app.listen(8080);

parser.parseData();

console.log('DONE?');

