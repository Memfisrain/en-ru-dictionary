;(function() {
	"use strict";

	angular.module('myApp')
		.directive('myGetButton', function() {
			// Runs during compile
			return {
				restrict: "A",
				scope: {},
				link: function($scope, iElm, iAttrs, controller) {
					var enWordInput = window.document.getElementById("my-input");

					iElm.bind("click", function() {
						enWordInput.focus();
					});
				}
			};
		});
})();