var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.sendfile('demo.html');
});



app.get(/^(.+)$/, function(req, res) { res.sendfile('dist' + req.params[0]); });

app.listen(3001);
console.log('Browse to http://localhost:3001/ for docs');

