;(function() {
	"use strict";

	angular.module('myApp.myBlurAfterSave', [])
		.directive('myBlurAfterAdd', ['$animate', function($animate){
			// Runs during compile
			return {
				restrict: "A",
				scope: {
					hasError: "=",
				},
				link: function(scope, iElm, iAttrs, controller) {
					var enWordInput = window.document.getElementById("en-word");
					
					if (!enWordInput.oninput) {
						enWordInput.oninput = function(e) {
							if (!scope.hasError) return;
							console.log("hasError = true")
							scope.hasError = false;
							scope.$digest();
						};
					}
					
					scope.$watch("hasError", function(n, o) {
						iElm.prop("disabled", n);
					});
		
					iElm.on("click", function() {
						iElm[0].blur();
		
						if (scope.hasError) return;
		
						var input = document.getElementsByClassName("word")[0],
							rect = input.getBoundingClientRect(),
							html = document.documentElement,
							from = window.pageYOffset,
							to = html.scrollHeight - html.clientHeight + 37; // add 37 pixel because new row insert after getting height
							
							function drawFn(progress) {
								var v = from + progress * to
								document.body.scrollTop = v;
							}
						
		
						$animate({
							duration: 500,
							timing: function(time) {
								return time;
							},
							draw: drawFn
						});
		
					})
				}
			};
		}])
})();