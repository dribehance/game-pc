// by dribehance <dribehance.kksdapp.com>
angular.module("Game").factory("tokenInterceptor", function($location, $q, $timeout, localStorageService, errorServices, config) {
	return {
		// optional method
		'request': function(config) {
			// do something on success
			return config;
		},
		// optional method
		'requestError': function(rejection) {
			// console.log(rejection)
			// do something on error
			// if (canRecover(rejection)) {
			//     return responseOrNewPromise
			// }
			// return $q.reject(rejection);
		},
		// optional method
		'response': function(response) {
			// do something on success
			var defer = $q.defer();
			// static response
			if (response.config.url.indexOf(".html") > 0) {
				return response;
			}
			// server response
			if (response.data.code == config.request.TOKEN_INVALID) {
				console.log("TOKEN_INVALID")
				localStorageService.remove("token");
				errorServices.autoHide("请先登录");
				$timeout(function() {
					$location.path("/signin").replace();
				}, 500)
				return defer.promise;
			} else {
				return response;
			}
			return response;
		},
		// optional method
		'responseError': function(rejection) {
			var defer = $q.defer();
			errorServices.requestError(rejection.data, rejection.status, rejection.headers, rejection.config);
			return defer.promise;
		}
	}
})