var http= require("http");
var express=require("express");;
var fs=require('fs');
const app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/',function(request,response){
    response.sendFile("/home/vimal974ever/Desktop/Kahoot/index.html");
});

app.get("/join",function(request,response){
    response.sendFile("/home/vimal974ever/Desktop/Kahoot/index.html");
});

app.post('/join_check',urlencodedParser,function(request,response){
    var team=request.body.teamname;
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("kahoot");
        var query = { teamname: team };
        dbo.collection("team").find(query).toArray(function(err, result) {
          if (err) throw err;
          db.close();
          if(result.length!=0)
          {
            console.log("Team name already taken");
            response.send("Team name already taken");
          }
          else 
          {
            MongoClient.connect(url,{ useNewUrlParser: true },function(err, db) {
                if (err) throw err;
                var dbo = db.db("kahoot");
                var myobj = { teamname: team, score:0};
                dbo.collection("team").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  console.log("Team "+team+" joined the game.");
                  response.send("Successfully joined the team");
                  db.close();
                });
              });
          } 
        });
      });
});


http.createServer(app).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');


