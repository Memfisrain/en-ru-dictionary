;(function() {
	'use strict';

	angular.module('myApp.view2')
		.controller('View2Ctrl', ["$scope", "words", function($scope, words) {
			var gen, startTime;
		
			$scope.testBegin = false;
			$scope.showIncorrectAnswers = false;
		
			$scope.startTest = startTest;
			$scope.check = check;
			$scope.endTest = endTest;
		
		
			function startTest() {
				$scope.wordsArray = getWordsInArbitraryOrder(words.slice(0));
				$scope.testBegin = true;
				$scope.questionCount = +$scope.countWords || $scope.wordsArray.length;
				$scope.questionIndex = 0;
		
				gen = wordSequence();
		
				$scope.time = null;
				$scope.correctCount = 0;
				$scope.incorrectCount = 0;
				startTime = new Date;
				next();
		
				$scope.incorrectAnswers = [];
			};
		
			function endTest() {
				$scope.testBegin = false;
				$scope.time = ( (new Date - startTime )/ 1000 ).toFixed(2) + "s";
				$scope.showIncorrectAnswers = true;
			}
		
			function next() {
				$scope.en = gen.next().value;
		
				if (!$scope.en) {
					endTest();
				}
		
				$scope.questionIndex++;
				$scope.myAnswer = "";
			}
		
			function* wordSequence() {
				for (var i = 0, len = $scope.questionCount; i < len; i++) {
					$scope.translate = $scope.wordsArray[i].allRu;
					yield $scope.wordsArray[i].en;
				}
			}
		
			function check() {
				if ($scope.translate.indexOf($scope.myAnswer) !== -1) {
					$scope.correctCount++;
				} else {
					$scope.incorrectCount++;
					$scope.incorrectAnswers.push({question: $scope.en, answer: $scope.myAnswer});
				}
		
				next();
			}
		
			function getWordsInArbitraryOrder(arr) {
				return arr.sort(function(a, b) {
					return Math.random() - Math.random();
				});
			}
		
		}]);
})();



