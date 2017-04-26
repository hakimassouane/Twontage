var app = angular.module('userClipListApp', ['requestModule']);

app.controller('userClipListCtrl', function($scope, $location, $interval, requestFactory) {
	angular.element(document).ready(function () {
		init();
	});

	function init() {
		$scope.listOfClips = [];
		makeRequest();
	};

	function makeRequest() {
		requestFactory.getUserClipList()
		.then(function(res) {
			console.log(res);
			res.data.forEach(function(element) {
  				$scope.listOfClips.push(element);
			});
		}).catch(function(err){
			console.log("error catched in makeRequest");
		})
	}

	$scope.handleLoadMoreOnClick = function(isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	}

	$scope.handleDeleteClick = function(isBtnPressed, $element) {
		if (isBtnPressed)
			deleteClick($element);
	}
	
	function loadMoreOnClick() {
		makeRequest($scope.urlGameName, cursor);
	}

	function deleteClick($element) {
		var obj = angular.element($element.target).attr('data-clip');
		requestFactory.deleteClipInDb(obj)
		.then(function(res) {
			requestFactory.getUserClipList()
			.then(function(res) {
				$scope.listOfClips.length = 0;
				res.data.forEach(function(element) {
  					$scope.listOfClips.push(element);
				});
				// TODO : We use document until we find a better way to implement this 
				document.getElementById('alert-delete').style.display = "block";
				document.getElementById('alert-delete').innerHTML = 'You succesfully deleted the clip : <strong>'+ JSON.parse(obj).title + '</strong>';
				countdown(2)
			}).catch(function(err) {
				console.log("error catched in getUserClipList : " + err);
			});
		}).catch(function(err) {
			console.log("error catched in deleteClipInDb");
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

//Directive to avoid loading clips before clicking on thumbnail
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

//Filter for date format under clips
app.filter('timesince', function ($filter) {
  return function (input) {
  		return moment(input).fromNow();
  };
});
