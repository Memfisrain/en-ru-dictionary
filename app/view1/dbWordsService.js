;(function() {
	"use strict";

	angular.module('view1.dbWordsService', [])
		.factory('dbWordsService', ['$http', function($http) {

			function getWord(word) {
				return $http.post("/search", {word: word});
			}

			function saveWords(words) {
				return $http.post("/save", words);
			}
			

			return {
				getWord: getWord,
				saveWords: saveWords
			};

		}])
})();