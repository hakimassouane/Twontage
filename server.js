var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://hakim:leboss93@ds115110.mlab.com:15110/hakimlab';
var path = require('path');
var fs = require('fs');
const download = require('download');
var request = require("request");
var cheerio = require("cheerio");

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
	var database = MongoClient.connect(url);
	database.then(function(db) {
		tryToAddClip(db, req.body);
		res.end();
	});
});

app.post('/api/delete', function (req, res) {
	var database = MongoClient.connect(url);
	database.then(function(db) {
		tryToDelClip(db, req.body);
		res.end();
	});
});

function tryToAddClip(db, clip) {
	db.collection('Clips').find({ 'id': clip.id }).toArray()
	.then(function(items) {
		if (items.length <= 0){
			db.collection('Clips').insertOne(clip, function(err, result) {
				request({
				  uri: 	clip.url,
				}, function(error, response, body) {
					const parsedHTML = cheerio.load(body);
					var toParse = parsedHTML('script').last().get()[0].children[0].data.toString()
					var videoURL = toParse.substring(toParse.indexOf(':"h') + 2, toParse.indexOf("mp4") + 3);
					console.log(videoURL);
					download(videoURL).then(data => {
   						 fs.writeFileSync('test.mp4', data);
					});
				});
    			console.log("Inserted a clip in Db.");
  			});
		}
		db.close();
    }).catch(function(err) {
    	console.log("Couldn't add clip because of an error in db");
    })
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
    	console.log("Couldn't add clip because of an error in db");
    })
}

let server = app.listen(3000, function(){
	console.log("App launched listening on port : 3000")
});



















	/*var options = {
  		url: 'https://api.twitch.tv/kraken/games/top?limit=12',
  		headers: {
  		'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
  		'Accept': 'application/vnd.twitchtv.v4+json'}
	};
	request(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			result = JSON.parse(body);
			console.log(result.top);
			res.render('index', {gamelist: result.top});
		}
	});*/


/*	var gamename = req.params.gamename;
	var options = {
  		url: 'https://api.twitch.tv/kraken/clips/top?limit=5&game=' + gamename,
  		headers: {
  		'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
  		'Accept': 'application/vnd.twitchtv.v4+json'}
	};
	request(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			result = JSON.parse(body);
			console.log("LIST OF CLIPS BEFORE RETURN ---- >", result.clips);
			var listofurls = [];
			result.clips.forEach(function(clip){
				var urlfalse = "&autoplay=false";
				var resulturl = clip.embed_url.concat(urlfalse);
				listofurls.push(resulturl);
			});
			res.render('gamepage', {clips: result.clips, urls: listofurls, name: gamename});
  		}
	});*/