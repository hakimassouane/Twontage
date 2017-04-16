var app = angular.module('gamepageApp', []);

app.factory("requestFactory", function($http){
	 return {
        getClipList: function(gameName) {
			var options = {
			  		headers: {
			  		'Client-ID': '7m12f7tzdcfgluzt537v3yo66j6lno',
			  		'Accept': 'application/vnd.twitchtv.v4+json'}
				};
            return $http.get('https://api.twitch.tv/kraken/clips/top?game=' + gameName, options);
        }
    };
});

app.controller('clipListCtrl', function($scope, $location, requestFactory) {
	$scope.gameName = $location.absUrl().substring($location.absUrl().lastIndexOf("/") + 1);
	init();
	
	function init () {
		$scope.listOfClips = [];
		makeRequest($scope.gameName);
	};

	$scope.handleClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	function makeRequest(gameName) {
		var promise = requestFactory.getClipList(gameName);
		promise.then(function(res) { 
			console.log(res);
			console.log(res.data.clips);
			$scope.listOfClips = res.data.clips;
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


app.directive('clips', function(){
    return {
        template: '<i ng-if="!clip.show" ng-click="clip.show=!clip.show" class="fa fa-play thumb-play"></i>' + 
        '<img ng-if="!clip.show" src="{{clip.thumbnails.medium}}" ng-click="clip.show=!clip.show" class="img-fluid clip-thumb">' +  
        '<iframe ng-if="clip.show" frameborder="0" ng-class="iFrame" class="col-md-12 iframeclip" scrolling="no" allowfullscreen="true" src="{{clip.embed_url | trusted}}"></iframe>'
    }
})

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
