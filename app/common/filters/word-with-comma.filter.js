;(function() {
	"use strict";

	angular.module('myApp')
		.filter("wordWithComma", function() {
			return function(words) {
				return words.join(", ");
			};
		});

})();