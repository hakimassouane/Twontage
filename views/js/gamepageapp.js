var app = angular.module('gamepageApp', ['requestModule']);

app.controller('clipListCtrl', function($scope, $location, requestFactory) {
	var urlGameName = $location.absUrl().substring($location.absUrl().lastIndexOf("/") + 1);
	$scope.gameName = urlGameName.replace(/%20/g, ' ');
	init();
	
	function init () {
		$scope.listOfClips = [];
		makeRequest(urlGameName, '');
	};

	$scope.handleClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	function makeRequest(gameName, filters) {
		var promise = requestFactory.getClipList(gameName, filters);
		promise.then(function(res) { 
			console.log(res);
			res.data.clips.forEach(function(element) {
  				$scope.listOfClips.push(element);
			});
			cursor = '&cursor=' + res.data._cursor;
			console.log($scope.listOfClips);
		},
		function(errorPayload) {
			console.log('failure loading request', errorPayload);
		});
	}
	
	function loadMoreOnClick()
	{
		makeRequest(urlGameName, cursor);
	}


});

app.directive('clips', function(){
    return {
        template: '<i ng-if="!clip.show" ng-click="clip.show=!clip.show" class="fa fa-play thumb-play"></i>' + 
        '<img ng-if="!clip.show" src="{{clip.thumbnails.medium}}" ng-click="clip.show=!clip.show" class="img-fluid clip-thumb">' +  
        '<iframe ng-if="clip.show" frameborder="0" ng-class="iFrame" class="col-md-12 iframeclip" scrolling="no" allowfullscreen="true" src="{{clip.embed_url | trusted}}"></iframe>'
    }
})

//Filter to allow request to distant website as trusted
app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


app.filter('timesince', function ($filter) {
  return function (input) {
  		return moment(input).fromNow();
  };
});
