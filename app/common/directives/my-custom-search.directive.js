;(function() {
	"use strict";

	angular.module('myApp')
		.directive('myCustomSearch', function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, iElm, iAttrs, controller) {
					var input = iElm[0],
						placeholder = window.document.querySelector(".search-wrap-placeholder"),
						icon = window.document.querySelector(".search-wrap-icon");


					input.addEventListener("focus", inputAddStyle, false);
					input.addEventListener("blur", inputRemoveStyle, false);
					placeholder.addEventListener("click", inputFocus, false);


					function inputFocus() {
						input.focus();
					}

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

				}
			};
		})
})();