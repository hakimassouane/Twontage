var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var databaseURL = 'mongodb://hakim:leboss93@ds115110.mlab.com:15110/hakimlab';
var ejs = require('ejs')
  , moment = require('moment');

app.locals.fromNow = function(date){
  return moment(date).fromNow();
}

mongoose.connect(databaseURL, function(err) {
  if (err) { throw err; }
  else
  	console.log("connection to database : done");
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get('/', function(req, res){
	var options = {
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
	});
})

/*app.get('/gamepage', function(req, res){
	var options = {
  		url: 'https://api.twitch.tv/kraken/clips/top?limit=10&game=Counter-Strike:+Global+Offensive&trending=true',
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
			res.render('gamepage', {clips: result.clips, urls: listofurls});
  		}
	});
})*/

app.get('/gamepage/:gamename', function(req, res){
	var gamename = req.params.gamename;
	var options = {
  		url: 'https://api.twitch.tv/kraken/clips/top?limit=10&game=' + gamename + '&trending=true',
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
	});
})

app.post('/bookmark', function(req, res){
	
});

var server = app.listen(3000, function(){
});