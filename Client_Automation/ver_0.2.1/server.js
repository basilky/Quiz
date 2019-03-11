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
    response.sendFile("/home/vimal974ever/Desktop/Kahoot/ver_0.2/index.html");
});

app.get("/join",function(request,response){
    response.sendFile("/home/vimal974ever/Desktop/Kahoot/ver_0.2/index.html");
});

app.get("/test",function(request,response){
  response.sendFile("/home/vimal974ever/Desktop/Kahoot/ver_0.2/test.html");
});

app.get('/teams_list',function(request,response){
  response.sendFile("/home/vimal974ever/Desktop/Kahoot/ver_0.2/index.html");
});

app.get("/get_question",function(request,response){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("kahoot");
    var query = { "isquestion" : "true" };
    dbo.collection("sample").find(query).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      if(result.length!=0)
      {
        response.send(JSON.stringify(result));
      }
      });
    });
});

app.post("/update_score",urlencodedParser,function(request,response){
    result=JSON.parse(JSON.stringify(request.body));
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("kahoot");
      var myquery = { teamname: result.teamname };
      var new_score = 1;
      var time_remain = result.time_remain;
      dbo.collection("team").find(myquery).toArray(function(err, result){
        var old_score = result[0].score;
        var newvalues = { $set: { score: old_score + new_score , last_question_time : time_remain } };
        dbo.collection("team").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        db.close();
        console.log("Team "+result[0].teamname+" submitted in "+(10-time_remain+"s"))
        // console.log("Result updated for "+JSON.stringify(myquery)+" to "+JSON.stringify(newvalues));
        });
      });
    });
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
            response.send(JSON.stringify({"text" : "Team name already taken","redirect" : "/join","join" : "false"}));
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
              var obj = {"text" : "Successfully joined the team","redirect" : "/test","join" : "true"};
              response.send(JSON.stringify(obj));
              db.close();
              });
            });
          } 
        });
      });
});



http.createServer(app).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');


