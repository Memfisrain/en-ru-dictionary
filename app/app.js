'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.filter("wordWithComma", function() {
	return function(words) {
		return words.join(", ");
	};
})
/*.factory('Vocabulary',['$resource', function($resource){
	return $resource("words/words.json", {
		save: {method: "POST"}
	});
}])*/
.factory('Vocabulary',['$http', function($http) {
	return $http.get("/allwords");
}])
.directive('blurAfterAdd', ['$animate', '$rootScope', function($animate, $rootScope){
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
					scope.$apply();
				};
			}
			
			scope.$watch("hasError", function(n, o) {
				iElm.prop("disabled", n);
			});

			iElm.on("click", function() {
				iElm[0].blur();

				if (scope.hasError) return;

				var input = document.getElementsByClassName("word")[0];
				var rect = input.getBoundingClientRect();
				var html = document.documentElement;

				
				var from = window.pageYOffset;
				var to = html.scrollHeight - html.clientHeight + 37; // add 37 pixel because new row insert after getting height
					
				var drawFn = function(progress) {
					var v = from + progress * to
					document.body.scrollTop = v;
				}
				

				animate({
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
.directive('blurAfterSave', ['$animate', function($animate){
	// Runs during compile
	return {
		restrict: "A",
		scope: {},
		link: function(scope, iElm, iAttrs, controller) {

			iElm.on("click", function() {
				iElm[0].blur();

				if (scope.hasError === "true") return;

				var input = document.getElementsByClassName("word")[0];
				var rect = input.getBoundingClientRect();
				var html = document.documentElement;
 
				var from = window.pageYOffset;
				var to = from + rect.top;

				var drawFn = function(progress) {
					var v = from -  progress * from;
					document.body.scrollTop = v;
				}
				

				animate({
					duration: 500,
					timing: function(time) {
						return time;
					},
					draw: drawFn,
					complete: function() {
						input.focus();						
					}
				});

			})
		}
	};
}])
.directive('myCustomSearch', function(){
	return {
		restrict: "A",
		scope: {},
		link: function($scope, iElm, iAttrs, controller) {
			var input = iElm[0];
			var placeholder = window.document.querySelector(".search-wrap-placeholder");
			var icon = window.document.querySelector(".search-wrap-icon");

			function inputAddStyle() {
				placeholder.style.top = "-18px";
				placeholder.style.fontSize = "85%";
				placeholder.style.color = icon.style.color = "#F68C04";

			}

			function inputRemoveStyle() {
				placeholder.style.top = "";
				placeholder.style.fontSize = "";
				placeholder.style.color = icon.style.color = "";
			}

			input.onfocus = function() {
				inputAddStyle();
			};

			input.onblur = function() {
				inputRemoveStyle();
			};

			placeholder.onclick = function() {
				input.focus();
			};
		}
	};
})
.directive('myButton',  ["$timeout", function($timeout){
	// Runs during compile
	return {
		restrict: "E",
		scope: {},
		transclude: true,
		template: "<button class='btn btn-primary my-end-button' ng-transclude></button>",
		link: function($scope, iElm, iAttrs, controller) {
			console.log(iElm);
			iElm.bind("click", function(event) {
				var but = event.target;

				while (but.tagName !== "BUTTON" && but.tagName !== "BODY") {
					but = but.parentNode;
				}

				if (but && but.tagName === "BODY") {
					return;
				}

				var butCoords = but.getBoundingClientRect();

				var x = event.clientX - butCoords.left;
				var y = event.clientY - butCoords.top;

				var div = document.createElement("div");
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

				div.addEventListener("transitionend", endCircleTransition);
				but.addEventListener("transitionend", endButTransition);


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
}])
.directive('myCheckStatus', function(){
	// Runs during compile
	return {
		restrict: "A",
		scope: {
			hasError: "="
		},
		link: function($scope, iElm, iAttrs, controller) {
			var enWordInput = angular.element(window.document.getElementById("my-input"));
			var button = angular.element(window.document.getElementById("my-get-button"));
			
			enWordInput.on("input", function(e) {
				console.log($scope);
				if (!$scope.hasError) return;

				$scope.hasError = false;
				$scope.$apply();
			});
			
			$scope.$watch("hasError", function(n, o) {
				button.prop("disabled", n);
				
				if (n) {
					button.addClass("my-disabled");
				} else {
					button.removeClass("my-disabled")
				}
			});
		}
	};
})
.directive('myGetButton', function(){
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
})


