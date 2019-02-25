#!/usr/bin/env nodejs
var http = require('http');
var url = require('url');
http.createServer(function (req, res)
{
  var pathname = url.parse(req.url).pathname;
  switch (pathname)
  {
    case '/question':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('Hello World\n');
      var current_qn = getcurrent();
      if (current_qn == 0)
      {
        res.end(JSON.stringify({ id: 0 }));
      }
      getquestion(current_qn);
      break;
    case '/nextquestion':
      gotonext();
    default:
      res.end('main page');
      break;
  }
}).listen(8080, 'playground.vm');
console.log('Server running at http://localhost:8080/');
function getquestion(qn_no)
{
  var mongoClient = require("mongodb").MongoClient;
  var server = "mongodb://localhost:27017/kahoot";
  mongoClient.connect(server, function (error, db)
  {
    if (error)
    {
      console.log("Error while connecting to database: ", error);
    }
    else
    {
      console.log("Connection established successfully");
      var questions = db.collection("questions");
      var filter = { "id": qn_no };
      questions.find(filter).toArray(function (error, documents)
      {
        if (error)
          console.log("Error: ", error);
        else
        {
          documents.forEach(function (doc)
          {
            console.log(doc);
          });
        }
      });
    }
    db.close();
  });
}
function getcurrent()
{
  var mongoClient = require("mongodb").MongoClient;
  var server = "mongodb://localhost:27017/kahoot";
  mongoClient.connect(server, function (error, db)
  {
    if (error)
    {
      console.log("Error while connecting to database: ", error);
    }
    else
    {
      console.log("Connection established successfully");
      var current = db.collection("current");
      var filter = {};
      current.find(filter).toArray(function (error, documents)
      {
        if (error)
          console.log("Error: ", error);
        else
        {
          documents.forEach(function (doc)
          {
            return doc.current;
          });
        }
      });
    }
    db.close();
  });
}