;(function() {
	'use strict';

	// Declare app level module which depends on views, and components
	angular.module('myApp', [
	  'ngRoute',
	  'ngResource',
	  'ngAnimate',
	  'myApp.view1',
	  'myApp.view2',
	  'myApp.myCheckStatus',
	  'myApp.myGetButton',
	  'myApp.myCustomSearch',
	  'myApp.myBlurAfterAdd',
	  'myApp.myBlurAfterSave',
	  'myApp.myButton',
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
})();





