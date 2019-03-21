#!/usr/bin/env nodejs
var http = require('http');
var url = require('url');
http.createServer(function (req, res)
{
  var mongoClient = require("mongodb").MongoClient;
  var server = "mongodb://localhost:27017/fossart";
  mongoClient.connect(server, function (error, db)
  {
    if (error)
    {
      console.log("Error while connecting to database: ", error);
    }
    else
    {
      var pathname = url.parse(req.url).pathname;
      switch (pathname)
      {
        case '/question':
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
                console.log(doc);
                if (doc.current == 0)
                {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end('{"id":0}');
                }
                else
                {
                  var questions = db.collection("questions");
                  var filter = { "id": doc.current };
                  questions.find(filter).toArray(function (error, documents)
                  {
                    if (error)
                      console.log("Error: ", error);
                    else
                    {
                      documents.forEach(function (doc)
                      {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(doc));
                      });
                    }
                  });
                }
              });
            }
          });
          break;
        case '/next':
          var current = db.collection("current");
          current.update({}, { $inc: { current: 1 } }
          );
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
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('{ "status": "success","current":"' + doc.current + '"}');
              });
            }
          });
          /* res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{ "status": "success" }'); */
          break;
        default: break;
      }
    }
  });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
