var app = angular.module('indexApp', []);

app.factory("requestFactory", function($http){
	 return {
        getGameList: function(offset) {
        	var options = 
        	{ 
				headers: 
				{ 
        			'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
  					'Accept': 'application/vnd.twitchtv.v4+json'
  				}
        	}
        	console.log("the url is ------ >   " + 'https://api.twitch.tv/kraken/games/top?limit=12' + offset);
            return $http.get('https://api.twitch.tv/kraken/games/top?limit=12' + offset, options);
        }
    };
});

app.controller('gameListCtrl', function($scope, requestFactory) {
	var lazyNext = '';
	initPage();

	$scope.handleClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	function initPage() {
		$scope.listOfGames = [];
		makeRequest('');
	};

	function makeRequest(offset) {
		var promise = requestFactory.getGameList(offset);
		promise.then(function(res) { 
			res.data.top.forEach(function(element) {
  				$scope.listOfGames.push(element);
			});
			console.log($scope.listOfGames);
			lazyNext = res.data._links.next.substring(res.data._links.next.indexOf('&'));
		},
		function(errorPayload) {
			$log.error('failure loading movie', errorPayload);
		});
	}
	
	function loadMoreOnClick()
	{
		makeRequest(lazyNext);
	}
});
