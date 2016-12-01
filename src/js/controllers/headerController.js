// by dribehance <dribehance.kksdapp.com>
angular.module("Game").controller("headerController", function($scope, errorServices, toastServices, localStorageService, config) {
	$scope.signin = function() {
		$scope.login = true;
	}
	$scope.logout = function() {
		$scope.login = false;
	}
})