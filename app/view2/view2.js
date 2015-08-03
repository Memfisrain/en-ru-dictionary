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
}])

.controller('View2Ctrl', ["$scope", "words", function($scope, words) {
	$scope.testBegin = false;
	$scope.startTest = startTest;
	$scope.check = check;
	$scope.endTest = endTest;

	$scope.setValue1 = function() {
		console.log("increment value 1");
		$scope.value1 = ++$scope.value1 || 1;
	};

	$scope.setValue2 = function() {
		console.log("increment value 2");
		$scope.value2 = ++$scope.value2 || 1;
	};

	$scope.$watch("::value1", function(newValue) {
		console.log("string:", newValue);
	});

	$scope.$watch("::{key1: value1, key2: value2}", function(newValue) {
		console.log("object:", newValue);
	}, true);

	var gen, startTime;

	function startTest() {
		$scope.wordsArray = getWordsInArbitraryOrder(words);
		$scope.testBegin = true;
		$scope.questionCount = +$scope.countWords || $scope.wordsArray.length;
		$scope.questionIndex = 0;
		gen = wordSequence();
		$scope.time = null;
		$scope.mistakeCount = 0;
		startTime = new Date;
		next();
	};

	function endTest() {
		$scope.testBegin = false;
		$scope.time = ( (new Date - startTime )/ 1000 ).toFixed(2) + "s";
	}

	function next() {
		$scope.en = gen.next().value;

		if (!$scope.en) {
			endTest();
		}

		$scope.questionIndex++;
		$scope.myAnswer = "";
	}

	function* wordSequence() {
		for (var i = 0, len = $scope.questionCount; i < len; i++) {
			$scope.translate = $scope.wordsArray[i].allRu;
			yield $scope.wordsArray[i].en;
		}
	}

	function check() {
		if ($scope.translate.indexOf($scope.myAnswer) !== -1) {
			next();
		} else {
			$scope.mistakeCount++;
		}
		
		return;
	}

	function getWordsInArbitraryOrder(arr) {
		return arr.sort(function(a, b) {
			return Math.random() - Math.random();
		});
	}
}])
.directive('myButton',  function(){
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

				setTimeout(function() {
					but.style.boxShadow = "-3px 3px 6px 1px rgba(10, 10, 10, .6)";
					div.style.width = "120px";
					div.style.height = "120px";
					div.style.top = "-30px";
					div.style.left = "-30px";
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
});
