'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl',
    resolve: {
    	words: ["$http", function($http) {
    		return $http.get("words/words.json")
    	}]
    }
  });
}])

.controller('View2Ctrl', ["$scope", "words", function($scope, words) {
	console.log($scope);
	$scope.testBegin = false;
	$scope.words = words.data;
	$scope.wordsArray = getWordsInArbitraryOrder($scope.words);

	$scope.startTest = startTest;
	$scope.check = check;
	$scope.endTest = endTest;

	var gen = wordSequence();

	function startTest() {
		$scope.testBegin = true;
		$scope.questionCount = getLength($scope.words);
		$scope.questionIndex = 0;
		next();
	};

	function getLength(obj) {
		return Object.keys(obj).length;
	}

	function endTest() {
		$scope.testBegin = false;
	}

	function next() {
		$scope.en = gen.next().value;
		$scope.questionIndex++;
		$scope.myAnswer = "";
	}

	function* wordSequence() {
		for (var i = 0; i < $scope.wordsArray.length; i++) {
			yield $scope.wordsArray[i];
		}
	}

	function check() {
		var translate = $scope.words[$scope.en];
		if (translate.indexOf($scope.myAnswer) !== -1) {
			next();
		}
		return;
	}

	function getWordsInArbitraryOrder(obj) {
		return Object.keys(obj).sort(function(a, b) {
			return Math.random() - Math.random();
		});
	}
}]);