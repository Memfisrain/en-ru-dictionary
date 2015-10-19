;(function() {
	"use strict";

	angular.module('myApp.view1')
		.controller('View1Ctrl', ["$scope", "words", 'dbWordsService', function($scope, words, dbWordsService) {
			// main
			var newWords = [],
				enWords = [];
		
			words.forEach(function(o) {
				enWords.push(o.en);
			});
		
			$scope.word = {};
		
			$scope.words = words;
			$scope.showError = false;
			$scope.search = "";
			$scope.predicate = ""; // predicate for order of words
			$scope.reverse = false; // determine reverse order of words
			$scope.loading = false;
		

			// assign function which responsible for get / save word
			$scope.order = order;
			$scope.cancel = cancel;
			$scope.add = add;
			$scope.save = save;
		

		
			function order(predicate) {
				if ($scope.predicate === predicate) {
					$scope.reverse = !$scope.reverse;
					return;
				}
		
				$scope.reverse = false;
				$scope.predicate = predicate;
			}
		
			function cancel() {
				$scope.words.pop();
				enWords.pop();
				newWords.pop();
			}
		
			function getWordSuccessCb(res) {
				var data = res.data,
					allTranslatedWords = data && data.allTranslatedWords,
					originalWord = data && data.originalWord;
		
				$scope.loading = false;
		
				if (allTranslatedWords && originalWord) {
		
					addDataToModel(originalWord, allTranslatedWords);
					$scope.word.ru = $scope.word.en = "";
					console.log(allTranslatedWords);
		
				} else {
					$scope.showError = true;
				}
			}
		
			function getWordErrorCb(res) {
				$scope.loading = false;
				$scope.showError = true;
				console.log(res.status);
			}
		
			function saveWordSuccessCb(res) {
				console.log(res.status);
			}
		
			function saveWordErrorCb(res) {
				console.log(res.status);
			}
		
			function addDataToModel(originalWord, allTranslatedWords) {
				var newWordObj = {en: originalWord, ru: allTranslatedWords[0], allRu: allTranslatedWords};
				
				$scope.words.push(newWordObj);
				enWords.push(originalWord);
				newWords.push(newWordObj);
			}
		
			function add() {
				if (!$scope.word.en) return;
		
				var wordLowCase = $scope.word.en.toLowerCase();
				$scope.showError = false;
		
				if ( !wordLowCase || enWords.indexOf(wordLowCase) !== -1 ) {
					$scope.showError = true;
					return;
				}
				
				$scope.loading = true;
		
				dbWordsService.getWord(wordLowCase).then(getWordSuccessCb, getWordErrorCb);
			}
		
		
			function save() {
				if (!newWords.length) return;
		
				dbWordsService.saveWords(newWords).then(saveWordSuccessCb, saveWordErrorCb);
		
				newWords = [];
			}

		}]);
})();