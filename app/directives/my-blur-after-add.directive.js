;(function() {
	"use strict";

	angular.module('myApp.myBlurAfterAdd', [])
		.directive('myButton',  ["$timeout", function($timeout) {
			// Runs during compile
			return {
				restrict: "E",
				scope: {},
				transclude: true,
				template: "<button class='btn btn-primary my-end-button' ng-transclude></button>",
				link: function($scope, iElm, iAttrs, controller) {
					
					iElm.bind("click", function(event) {
						var but = event.target;

						var butCoords = but.getBoundingClientRect(),
							x = event.clientX - butCoords.left,
							y = event.clientY - butCoords.top,
							div = document.createElement("div");

						div.classList.add("circle");
						div.style.left = x + "px";
						div.style.top = y + "px";

						but.appendChild(div);

						$timeout(function() {
							but.style.boxShadow = "-3px 3px 6px 1px rgba(10, 10, 10, .6)";

							div.style.width = "220px";
							div.style.height = "220px";
							div.style.top = "-30px";
							div.style.left = "-30px";
							div.style.opacity = "0.1";
							but.blur();
						}, 0)

						div.addEventListener("transitionend", endCircleTransition, false);
						but.addEventListener("transitionend", endButTransition, false);


						function endCircleTransition(e) {
							div.removeEventListener("transitionend", endCircleTransition);
							but.removeChild(div);
						}

						function endButTransition(e) {
							but.style.boxShadow = "";
							but.removeEventListener("transitionend", endButTransition);
						}

					});

				}
			};
		}]);

})();