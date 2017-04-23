var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://hakim:leboss93@ds115110.mlab.com:15110/hakimlab';
var path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());


app.get('/', function(req, res){
	 res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/gamepage/:gamename', function(req, res){
	res.sendFile(path.join(__dirname + '/views/gamepage.html'));
})

app.get('/userclipspage', function(req, res){
	res.sendFile(path.join(__dirname + '/views/userclippage.html'));
})

app.get('/api/getbookmarkedclips', function(req, res){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('Clips').find().toArray()
    	.then(function(Items) {
      		console.log(Items); // Use this to debug
      		res.setHeader('Content-Type', 'application/json');
      		res.send(Items);
    	})
	});
});

app.post('/api/bookmark', function (req, res) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		tryToAddClip(db, req.body);
	});
  	res.end();
})

app.post('/api/delete', function (req, res) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		tryToDelClip(db, req.body);
	});
  	res.end();
})

function tryToAddClip(db, clip) {
	db.collection('Clips').find({"id":clip.id}).toArray(function(err, items) {
		if (err) {
			console.log("error ----- > ", err);
		} 
		else {
			console.log(items.length);
			if (items.length <= 0){
				db.collection('Clips').insertOne(clip, function(err, result) {
   					assert.equal(err, null);
    				console.log("Inserted a clip in Db.");
  				});
			} else {
				console.log('clip already exists')
				db.close();
			}
		}
	});
}

function tryToDelClip(db, clip) {
	db.collection('Clips').find({"id":clip.id}).toArray(function(err, items) {
		if (err) {
			console.log("error ----- > ", err);
		} 
		else {
			console.log(items.length);
			if (items.length <= 0){
				console.log('Clip Does not exist')
				db.close();
			} else {
				db.collection('Clips').remove({"id":clip.id}, function(err, result) {
   					assert.equal(err, null);
    				console.log("Removed a clip in Db.");
  				});
			}
		}
	});
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