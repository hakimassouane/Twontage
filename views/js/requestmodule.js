var app = angular.module('requestModule', []);

app.factory("requestFactory", function($http){
	 return {
        getGameList: function(offset) {
        	var options = { 
				headers: { 
        			'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
  					'Accept': 'application/vnd.twitchtv.v4+json' }
        		};
        	console.log("the url is ------ >   " + 'https://api.twitch.tv/kraken/games/top?limit=12' + offset);
            return $http.get('https://api.twitch.tv/kraken/games/top?limit=12' + offset, options);
        },
        getClipList: function(gameName, filters) {
			var options = {
			  		headers: {
			  		'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
			  		'Accept': 'application/vnd.twitchtv.v4+json'}
				};
            return $http.get('https://api.twitch.tv/kraken/clips/top?limit=12&game=' + gameName + filters, options);
        },
        putClipInDb: function(clipToPost) {
        	$http.put('/bookmark');
        }
    };
});