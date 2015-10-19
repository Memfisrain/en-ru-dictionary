;(function() {
	'use strict';

	// Declare app level module which depends on views, and components
	angular.module('myApp', [
	  'ngRoute',
	  'ngResource',
	  'ngAnimate',
	  'myApp.view1',
	  'myApp.view2',
	  'ui.bootstrap'
	])
		.config(['$routeProvider', function($routeProvider) {
		  $routeProvider.otherwise({redirectTo: '/view1'});
		}]);
	
})();





