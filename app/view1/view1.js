'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    resolve: {
    	words: ["Vocabulary", function(Vocabulary) {
    		return Vocabulary.then(function(obj) {
    			return obj.data;
    		});
    	}]
    }
  });
}])
.controller('View1Ctrl', ["$scope", "words", "$http", "$filter", "$interpolate", function($scope, words, $http, $filter, $interpolate) {
	var newWords = [];
	var enWords = [];

	var context = {greeting: 'Hello', name: undefined };
	// default "forgiving" mode
	var exp = $interpolate('{{greeting}} {{name}}!');
	console.log(exp(context));

	words.forEach(function(o) {
		enWords.push(o.en);
	});

	$scope.words = words;
	$scope.showError = false;
	$scope.search = "";
	$scope.predicate = ""; // predicate for order of words
	$scope.reverse = false; // determine reverse order of words

	$scope.order = function(predicate) {
		if ($scope.predicate === predicate) {
			$scope.reverse = !$scope.reverse;
			return;
		}

		$scope.reverse = false;
		$scope.predicate = predicate;
	};

	$scope.cancel = function() {
		$scope.words.pop();
		enWords.pop();
		newWords.pop();
	};

	/*$scope.word = {
		en: "property",
		ru: "свойство"
	};*/

	var reqCount = 0;

	$scope.add = function() {
		var wordLowCase = $scope.word.en.toLowerCase();
		$scope.showError = false;

		if ( !wordLowCase || enWords.indexOf(wordLowCase) !== -1 ) {
			$scope.showError = true;
			return;
		}

		console.log($scope.$$watchers);

		reqCount++;

		window.performance.mark("mark_start_xhr");

		$http.post("/search", {word: wordLowCase})
			.success(function(data, status, header, config) {
				window.performance.mark("mark_end_xhr");
				window.performance.measure("measure_xhr" + reqCount, "mark_start_xhr", "mark_end_xhr");
				measurePerf();

				if (data) {
					console.log(data);
					var newWordObj = {en: wordLowCase, ru: data[0], allRu: data};

					$scope.words.push(newWordObj);
					enWords.push(wordLowCase);
					newWords.push(newWordObj);

					$scope.word.ru = $scope.word.en = "";
				} else {
					$scope.showError = true;
				}
			})
			.error(function(data, status, header) {
				console.log(status);
			});
	};

	$scope.save = function() {
		if (!newWords.length) return;

		$http.post("/save", newWords).success(function(data, status, headers, config) {
			console.log(status);
		});

		newWords = [];
	};


	function measurePerf() {
		var perfEntries = window.performance.getEntriesByType("measure");
		for (var i = 0; i < perfEntries.length; i++) {
			console.log("XHR " + perfEntries[i].name + " took " + perfEntries[i].duration + "ms");
		}
	}

}]);