'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
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
.factory('Vocabulary',['$resource', function($resource) {
	return $resource("/words");
}])
.directive('blurMe', ['$animate', function($animate){
	// Runs during compile
	return {
		restrict: "A",
		scope: {
			blurMe: "@",
			hasError: "@"
		},
		link: function(scope, iElm, iAttrs, controller) {
			iElm.on("click", function() {
				iElm[0].blur();

				if (scope.hasError === "true") return;

				var input = document.getElementsByClassName("word")[0];
				var rect = input.getBoundingClientRect();
				var from, to, drawFn;
				var html = document.documentElement;

				if (scope.blurMe == "add") {
					from = window.pageYOffset;
					to = html.scrollHeight - html.clientHeight + 37; // add 37 pixel because new row insert after getting height
					
					drawFn = function(progress) {
						var v = from + progress * to
						document.body.scrollTop = v;
					}
				} else {
					from = window.pageYOffset;
				  to = from + rect.top;

				  drawFn = function(progress) {
				  	var v = from -  progress * from;
						document.body.scrollTop = v;
				  }
				}

				animate({
					duration: 500,
					timing: function(time) {
						return time;
					},
					draw: drawFn,
					complete: function() {
						if (scope.blurMe == "save") input.focus();						
					}
				});

			})
		}
	};
}] );