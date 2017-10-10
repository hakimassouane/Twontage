const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://hakim:leboss93@ds115110.mlab.com:15110/hakimlab';
const path = require('path');
const fs = require('fs');
const download = require('download');
const cheerio = require("cheerio");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
	 res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/gamepage/:gamename', function(req, res){
	res.sendFile(path.join(__dirname + '/views/gamepage.html'));
});

app.get('/userclipspage', function(req, res){
	res.sendFile(path.join(__dirname + '/views/userclippage.html'));
});

app.get('/api/getbookmarkedclips', function(req, res){
  MongoClient.connect(url, function(err, db) {
		db.collection('Clips').find().toArray()
    	.then(function(Items) {
      		res.setHeader('Content-Type', 'application/json');
      		console.log(Items);
      		res.send(Items);
    	})
	});
});

app.post('/api/bookmark', function (req, res) {
	const database = MongoClient.connect(url);
	database.then(function(db) {
		tryToAddClip(db, req.body);
		res.end();
	});
});

app.post('/api/delete', function (req, res) {
	const database = MongoClient.connect(url);
	database.then(function(db) {
		tryToDelClip(db, req.body);
		res.end();
	});
});

function checkIfClipExists(db, clipId) {
  db.collection('Clips').find({ 'id': clipId}).toArray()
    .then((items) => {
      return items.length <= 0
    })
    .catch(err => {
      console.log(err);
    })
}

function parseVideoUrl(body) {
  const parsedHTML = cheerio.load(body);
  const toParse = parsedHTML('script').last().get()[0].children[0].data.toString();
  return toParse.substring(toParse.indexOf(':"h') + 2, toParse.indexOf("mp4") + 3);
}

function tryToAddClip(db, clip) {
	if (checkIfClipExists(db, clip.id)) {
    db.collection('Clips').insertOne(clip, () => {
      request({
        uri: 	clip.url
      }, (error, response, body) => {
        download(parseVideoUrl(body)).then((data) => {
          fs.writeFileSync(clip.id + '.mp4', data);
        });
      });
    });
  }
  db.close();
}

function tryToDelClip(db, clip) {
	db.collection('Clips').find({ 'id': clip.id }).toArray().then(function(items) {
		if (items.length > 0){
			db.collection('Clips').remove({"id":clip.id}, function(err, result) {
    			console.log("Removed a clip in Db.");
  			});
		}
		db.close();
    }).catch(function(err) {
    	console.log(err, "Couldn't add clip because of an error in db");
    })
}

const server = app.listen(3000, function(){
	console.log("App launched listening on port : 3000")
});