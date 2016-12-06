// by dribehance <dribehance.kksdapp.com>
angular.module("Game").directive('userSidebar', function() {
	return {
		restrict: 'E',
		templateUrl: "templates/user_sidebar.html",
		scope: {
			active: "=",
			user: "="
		},
		link: function(scope, element, attrs) {
			// function body
		}
	};
});