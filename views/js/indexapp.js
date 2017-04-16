var app = angular.module('indexApp', ['requestModule']);

app.controller('gameListCtrl', function($scope, requestFactory) {
	var lazyNext = '';
	initPage();

	$scope.handleClick = function (isBtnPressed) {
		if (isBtnPressed)
			loadMoreOnClick();
	};

	function initPage() {
		$scope.listOfGames = [];
		makeRequest('');
		console.log(requestFactory);
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
			console.log('failure loading request', errorPayload);
		});
	}
	
	function loadMoreOnClick() {
		makeRequest(lazyNext);
	};
});
