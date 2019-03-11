var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("kahoot");
  var myobj = [
    { teamname: 'team3'},
    { teamname: 'team2'},
    { teamname: 'team1'}
  ];
  dbo.collection("team").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});