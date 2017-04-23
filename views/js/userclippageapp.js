var app = angular.module('userClipListApp', ['requestModule']);

app.controller('userClipListCtrl', function($scope, $location, requestFactory) {
	angular.element(document).ready(function () {
		init();
	});

	function init () {
		$scope.listOfClips = [];
		makeRequest();
	};

	function makeRequest() {
		var promise = requestFactory.getUserClipList();
		promise.then(function(res) { 
			console.log(res);
			res.data.forEach(function(element) {
  				$scope.listOfClips.push(element);
			});
		},
		function(errorPayload) {
			console.log('failure loading request', errorPayload);
		});
	}

	$scope.handleLoadMoreOnClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	$scope.handleDeleteClick = function (isBtnPressed, $element) {
		if (isBtnPressed)
			deleteClick($element);
	}
	
	function loadMoreOnClick()
	{
		console.log("wsh");
		makeRequest($scope.urlGameName, cursor);
	}

	function deleteClick($element)
	{
		console.log($element);
		var obj = angular.element($element.target).attr('data-clip');
		var promise = requestFactory.deleteClipInDb(obj);
		promise.then(function(res) { 
			console.log(res);
		},
		function(errorPayload) {
			console.log('failure loading request', errorPayload);
		});
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
