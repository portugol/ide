var express = require('express'),
  http = require('http'),
  nano = require('nano'),
  util = require('util');

var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

var nano_server = nano('http://130.185.82.181:5984');
var nano_db = nano_server.use('mydb');


//POST a /couchset
app.post('/couchset', function (req, res) {
  console.log("####################################################");
  console.log("ENVIA PARA O COUCHDB");
  console.log("####################################################");

  res.writeHead(200, {'Content-Type': 'application/json'});
  console.log(req.body);

  nano_db.insert(req.body, req.body._id, function(err){
    if (err) {
      res.write(JSON.stringify({'result': 'nok', 'message': err.message}));
    } else {
      res.write(JSON.stringify({'result': 'ok'}));
    }
    res.end();
  });
  
});


//GET a /couchget
app.get('/couchget/:document_id', function (req, res) {
  console.log("####################################################");
  console.log("VAI BUSCAR AO COUCHDB");
  console.log("####################################################");
  //console.log(req.query);

  res.writeHead(200, {'content-type':'text/html'});

  nano_db.get(req.params.document_id, function(err, val) {
    if (err) {
      res.write(JSON.stringify({'result': 'nok', 'message': err.message}));
    } else {
      res.write(JSON.stringify(val));
    }
    res.end();
  });
});

app.listen(80, function () {
  console.log("Server listening on port 80");
});
