var app = angular.module('gamepageApp', ['requestModule']);

app.controller('clipListCtrl', function($scope, $location, requestFactory) {
	angular.element(document).ready(function () {
		init();
	});

	function init () {
		$scope.urlGameName = $location.absUrl().substring($location.absUrl().lastIndexOf("/") + 1);
		$scope.gameName = $scope.urlGameName.replace(/%20/g, ' ');
		$scope.listOfClips = [];
		makeRequest($scope.urlGameName, '');
	};

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

	$scope.handleLoadMoreOnClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	$scope.handleBookmarkClick = function (isBtnPressed, $element) {
		if (isBtnPressed)
			bookmarkClick($element);
	}
	
	function loadMoreOnClick()
	{
		makeRequest($scope.urlGameName, cursor);
	}

	function bookmarkClick($element)
	{
		var obj = angular.element($element.target).attr('data-clip');
		requestFactory.putClipInDb(obj)
		.then(function(res){
			console.log(res);
			document.getElementById('alert-delete').style.display = "block";
			document.getElementById('alert-delete').innerHTML = 'You succesfully bookmarked the clip : <strong>'+ JSON.parse(obj).title + '</strong>';
		}).catch(function(err){
			console.log('Erorr in bookmarkClick', err);
		});
	}

	function countdown(counter) {
		// TODO : fix the countdown method because if we launch it 
		// multiple times it bugs without cleanrInterval(id)
		clearInterval(id);
		id = setInterval(function() {
		    counter--;
		    if(counter < 0) {
		        clearInterval(id);
		       	document.getElementById('alert-delete').style.display = "none";
		        console.log("done");
		    } 
		}, 1000);
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
