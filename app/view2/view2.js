;(function() {
	'use strict';

	angular.module('myApp.view2', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
		  $routeProvider.when('/view2', {
		    templateUrl: 'view2/view2.html',
		    controller: 'View2Ctrl',
		    resolve: {
		    	words: ["Vocabulary", function(Vocabulary) {
		    		return Vocabulary.then(function(obj) {
		    			return obj.data;
		    		});
		    	}]
		    }
		  });
		}]);

})();
