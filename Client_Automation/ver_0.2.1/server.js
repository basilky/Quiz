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

app.get('/get_team_list',function(request,response){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("kahoot");
    dbo.collection("team").find({}).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      if(result.length!=0)
      {
        response.send(JSON.stringify(result));
      }
      });
    });
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

app.get("/admin",function(request,response){
    response.sendFile("/home/vimal974ever/Desktop/Kahoot/ver_0.2/admin.html");
})

app.post("/update_score",urlencodedParser,function(request,response){
    MongoClient.connect(url,{ useNewUrlParser: true}, function(err,db){
      if(err) throw err;
      var dbo = db.db("kahoot");
      dbo.collection("team").find({}).toArray(function(err, result1) {
        if (err) throw err;
        result1.sort(function(a, b){
          return a.last_question_time-b.last_question_time;
        })
        //For 1st prize
        var myquery1 = { teamname: result1[result1.length-1].teamname };
        dbo.collection("team").find(myquery1).toArray(function(err, result) {
          var old_score = 0;
          old_score1 = result[0].score;
          newvalues1 = { $set: { score : old_score1 + 1000 } };
          // console.log(result1[result1.length-1].teamname+" scored 1000 points from "+old_score);
          

          MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("kahoot");
            dbo.collection("team").updateOne(myquery1, newvalues1, function(err, res) {
            if (err) throw err;
            console.log("\n----------------------------\n");
            console.log(JSON.stringify(newvalues1) + " for " + myquery1.teamname);
            });
          });
        });
        var myquery2 = { teamname: result1[result1.length-2].teamname };
        dbo.collection("team").find(myquery2).toArray(function(err, result) {
          var old_score2 = 0;
          old_score2 = result[0].score;
          newvalues2 = { $set: { score : old_score2 + 500 } };
          // console.log(result1[result1.length-2].teamname+" scored 500 points from "+old_score);

          MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("kahoot");
            dbo.collection("team").updateOne(myquery2, newvalues2, function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(newvalues2) + " for " + myquery2.teamname);
            });
          });
        });

        var myquery3 = { teamname: result1[result1.length-3].teamname };
        dbo.collection("team").find(myquery3).toArray(function(err, result) {
          var old_score3 = 0;
          old_score3 = result[0].score;
          newvalues3 = { $set: { score : old_score3 + 250 } };
          // console.log(result1[result1.length-3].teamname+" scored 250 points from "+old_score);
          

          MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("kahoot");
            dbo.collection("team").updateOne(myquery3, newvalues3, function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(newvalues3) + " for " + myquery3.teamname);
            console.log("\n----------------------------\n");
            });
          });
        });
        dbo.collection("team").updateMany({},{ $set: { last_question_time : 0 } },function(err,res){
          if (err) throw err;
        })
        db.close();
        });
    })
});

app.post("/submit_score",urlencodedParser,function(request,response){
    result=JSON.parse(JSON.stringify(request.body));
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("kahoot");
      var myquery = { teamname: result.teamname };
      var time_remain = result.time_remain;
      var newvalues = { $set: { last_question_time : time_remain } };
      dbo.collection("team").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
      console.log("Team "+result.teamname+" submitted in "+(10-time_remain+"s"));
      // console.log("Result updated for "+JSON.stringify(myquery)+" to "+JSON.stringify(newvalues));
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


