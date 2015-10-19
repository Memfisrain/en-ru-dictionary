;(function() {
	"use strict";

	angular.module('myApp')
		.factory('Vocabulary',['$http', function($http) {
			return $http.get("/allwords");
		}]);

})();