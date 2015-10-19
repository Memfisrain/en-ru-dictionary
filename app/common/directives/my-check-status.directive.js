;(function() {
	"use strict";

	angular.module('myApp')
		.directive('myCheckStatus', function() {
			// Runs during compile
			return {
				restrict: "A",
				scope: {
					hasError: "="
				},
				link: function(scope, iElm, iAttrs) {
					var enWordInput = angular.element(window.document.getElementById("my-input")),
						button = angular.element(window.document.getElementById("my-get-button"));
					
					enWordInput.on("input", function(e) {
						console.log("input");
						if (!scope.hasError) return;
	
						scope.hasError = false;
						scope.$apply();
					});
					
					scope.$watch("hasError", function(n, o) {
						button.prop("disabled", n);
	
						if (n) {
							button.addClass("my-disabled");
						} else {
							button.removeClass("my-disabled")
						}
					});
				}
			};
		});

})();