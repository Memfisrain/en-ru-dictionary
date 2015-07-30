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
.controller('View1Ctrl', ["$scope", "words", "$http", function($scope, words, $http) {
	var newWords = Object.create(null);
	$scope.words = {};

	$scope.showError = false;

	words.forEach(function(o) {
		$scope.words[o.word] = o.translate;
	});

	$scope.word = {
		en: "property",
		ru: "свойство"
	};

	var reqCount = 0;

	$scope.add = function() {
		var wordLowCase = $scope.word.en.toLowerCase();
		$scope.showError = false;

		if (!wordLowCase || wordLowCase in $scope.words) {
			$scope.showError = true;
			return;
		}

		reqCount++;

		window.performance.mark("mark_start_xhr");

		$http.post("/search", {word: wordLowCase})
			.success(function(data, status, header, config) {
				window.performance.mark("mark_end_xhr");
				window.performance.measure("measure_xhr" + reqCount, "mark_start_xhr", "mark_end_xhr");
				measurePerf();

				if (data) {
					$scope.words[wordLowCase] = newWords[wordLowCase] = data;
					$scope.word.ru = $scope.word.en = "";
					console.log(newWords);
				}
			})
			.error(function(data, status, header) {
				console.log(status);
			});
	};

	$scope.save = function() {
		/*$http.post("/save", $scope.words).success(function(data, status, headers, config) {
			console.log(status);
		});*/

		if (!Object.keys(newWords).length) return;

		$http.post("/save", newWords).success(function(data, status, headers, config) {
			console.log(status);
		});

		newWords = Object.create(null);
	};


	function measurePerf() {
		var perfEntries = window.performance.getEntriesByType("measure");
		for (var i = 0; i < perfEntries.length; i++) {
			console.log("XHR " + perfEntries[i].name + " took " + perfEntries[i].duration + "ms");
		}
	}

	
	/*$scope.word = {};
	$scope.vocabulary = Vocabulary.getVocabulary();

	$scope.save = function() {
		if (!$scope.word.ru || !$scope.word.en) return;
		Vocabulary.setWord($scope.word.en, $scope.word.ru);
		refresh();
	};

	function refresh() {
		$scope.vocabulary = Vocabulary.getVocabulary();
		$scope.word.ru = $scope.word.en = "";
	}*/
}]);