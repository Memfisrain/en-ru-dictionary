;(function() {
	'use strict';

	angular.module('myApp.view1', [
		'ngRoute',
		'view1.dbWordsService',
		'view1.controller'
		])
		.config(['$routeProvider', function($routeProvider) {
		  $routeProvider.when('/view1', {
		    templateUrl: 'view1/view1.html',
		    controller: 'View1Ctrl',
		    resolve: {
		    	words: ["Vocabulary", function(Vocabulary) {
		    		return Vocabulary.then(function(obj) {
		    			return obj.data;
		    		});
		    	}]
		    }
		  });
		}])
})();



