// by dribehance <dribehance.kksdapp.com>
angular.module("Game", [
		"ngRoute",
		// "ngSanitize",
		"LocalStorageModule",
		// "flow",
		"timer"
	])
	.config(function($routeProvider, $httpProvider, $locationProvider, localStorageServiceProvider, config) {
		angular.forEach(config.interceptor, function(path) {
			var controllername = path.replace(/_[a-z]/g, function(letter) {
				return letter.split("_")[1].toUpperCase();
			});
			controllername = controllername + "Controller";
			$routeProvider.when("/" + path, {
				templateUrl: "templates/" + path + ".html",
				reloadOnSearch: false,
				controller: controllername,
				resolve: {
					user: function($q, $location, localStorageService) {
					var resolve_path = ["bills", "orders", "recommandors", "recommand_income", "my_code", "modify_password", "messages", "online_withdraw"],
							defer = $q.defer();
						if (resolve_path.includes(path) && !localStorageService.get("token")) {
							defer.reject();
							$location.path("/index").replace();
							return;
						}
						defer.resolve();
						return defer.promise;
					}
				}
			})
		})
		$routeProvider.otherwise("/index");
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		delete $httpProvider.defaults.headers.common["X-Requested-With"];
		localStorageServiceProvider.setStorageCookie(1 / 50);
		$httpProvider.interceptors.push('tokenInterceptor');

	}).run(function(appServices) {
		// init event such as routechangestart...
		appServices.init();
	});