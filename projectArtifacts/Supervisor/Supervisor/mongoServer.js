var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var app = express();

var cors = require('cors')

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


var MongoClient = require('mongodb').MongoClient;
var db;

function trips() {
  this.routeid = "";
  this.trips = [];
}


// Initialize connection once
MongoClient.connect("mongodb://54.70.39.32:27017/VTADailyTrips", function (err, database) {
  if (err) return console.error(err);

  db = database;

  // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
});

// Reuse database object in request handlers
app.get("/", function (req, res, next) {
  // "FIELD1": { '$regex': '^10_' } }
  var arr = [];
  db.collection("Trips").find().toArray(function (error, documents) {
    if (error) throw error;
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.send(documents);
  });

});

app.get("/getTripsInfo", function (req, res, next) {

  console.log(req.body);
  // "FIELD1": { '$regex': '^10_' } }
  var arr = [];
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  db.collection("Trips").distinct('routeid', function (error, documents) {
    if (error) throw error;
    let promises = [];
    for (var i = 0; i < documents.length; i++) {

      console.log(documents[i]);

      promises.push(new Promise(resolve => {
        var _routeId = documents[i];
        db.collection('Trips').find({ 'routeid': _routeId }, { 'routeid': 1, 'shapeid': 1, 'currentlocation': 1, 'tripid': 1, 'description': 1, 'vehicletimestamp': 1, 'isvalid': 1, 'stop_seq': 1 }).toArray(function (errTrips, Tripdocuments) {
          var obj = new trips();
          obj.routeid = _routeId;
          obj.trips = Array.from(Tripdocuments)
          arr.push(obj);
          resolve(obj);
        });

      }));
    };
    Promise.all(promises).then(function (arr) { res.send(arr); });
  })
});

app.post("/getTripInfo", function (req, res, next) {

  console.log(req.body);
  // "FIELD1": { '$regex': '^10_' } }
  var arr = [];
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  db.collection('Trips').find({ 'routeid': req.body.data }).toArray(function (errTrips, Tripdocuments) {
    res.send(Tripdocuments);

  });


});



app.post("/getBusTripbyId", function (req, res, next) {

  //console.log(req.body);
  // "FIELD1": { '$regex': '^10_' } }
  var arr = [];
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  db.collection('Trips').find({ 'tripid': req.body.data }).toArray(function (errTrips, Tripdocuments) {
    res.send(Tripdocuments);

  });


});

app.post('/getRoutePaths', function (req, res, next) {
  console.log(req.body);

  db.collection('busPaths').find({ 'shapeid': { $in: req.body.data } }).toArray(function (errTrips, Tripdocuments) {
    res.send(Tripdocuments);

  });
});

app.post('/getShiftedRoutePaths', function (req, res, next) {
  console.log(req.body);

  db.collection('SelectedRouteShapes').find({ 'shapeid': { $in: req.body.data } }).toArray(function (errTrips, Tripdocuments) {
    res.send(Tripdocuments);

  });
});

app.use(function (err, req, res) {
  // handle error here.  For example, logging and returning a friendly error page
});

// Starting the app here will work, but some users will get errors if the db connection process is slow.  
app.listen(4000);
console.log("Listening on port 3000");

