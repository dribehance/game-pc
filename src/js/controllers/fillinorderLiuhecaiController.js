// by dribehance <dribehance.kksdapp.com>
angular.module("Game").controller("fillinorderLiuhecaiController", function($scope, $route, $timeout, $route, userServices, $interval, errorServices, toastServices, localStorageService, config) {
	$scope.input = {};
	// $scope.liuhecai = {}
	// $scope.liuhecai.waiting = false;
	// $scope.query_liuhecai = function() {
	// 	userServices.query_liuhecai().then(function(data) {
	// 		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
	// 			$scope.liuhecai = data;
	// 		} else {
	// 			errorServices.autoHide(data.message);
	// 		}
	// 		// interval call
	// 		if ($scope.liuhecai.waiting) {
	// 			$timeout(function() {
	// 				$scope.liuhecai.day_seconds = "";
	// 				$scope.query_liuhecai();
	// 			}, 5000)
	// 			return;
	// 		}
	// 	})
	// }
	// $scope.query_liuhecai();
	$scope.game_type = [{
		"label": "特码",
		"value": "1",
	}, {
		"label": "正码",
		"value": "2",
	}, {
		"label": "半波",
		"value": "3",
	}, {
		"label": "一肖/尾数",
		"value": "4",
	}, {
		"label": "特码生肖",
		"value": "5",
	}, {
		"label": "三中三",
		"value": "6",
	}, {
		"label": "三中二",
		"value": "7",
	}, {
		"label": "二中二",
		"value": "8",
	}];
	$scope.input.game_type = $scope.game_type[0];
	$scope.$watch("input.game_type", function(n, o) {
		if (n) {
			$scope.is_board_open = false;
			$scope.resetForm();
			$scope.query_liuhecai_peilv(n.value);
		}
	}, true);
	$scope.choose_game_type = function(index) {
		$scope.input.game_type = $scope.game_type[index];
	};
	$scope.query_liuhecai_peilv = function(type) {
		toastServices.show();
		userServices.query_liuhecai_peilv({
			g_type: type,
			o_type: $scope.input.game_type.value
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.games = data.Result.OddsGdkl10Beans;
				angular.forEach($scope.games, function(game, index) {
					angular.forEach(game.oIndexBeans, function(g, i) {
						g.betting_money = "";
						g.betted = false;
					})
				})
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// open popup
	$scope.show = function(cell, game) {
		if ($scope.liuhecai.waiting) {
			return;
		}
		if (cell.betted) {
			cell.betting_money = 0;
			cell.betted = false;
			return
		}
		$scope.popup_state = "open";
		$scope.input.selected_game_cell = cell;
		$scope.input.selected_game = game;
	}
	$scope.close = function() {
		$scope.popup_state = "close";
	};
	// betting
	$scope.betting = function() {
		var number_reg = /^[0-9]*$/;
		if (!number_reg.test($scope.input.betting_money) || $scope.input.betting_money < 1) {
			return;
		}
		$scope.input.selected_game_cell.betting_money = parseFloat($scope.input.betting_money);
		$scope.input.selected_game_cell.betted = true;
		$scope.popup_state = "close";
	};
	// timer callback
	$scope.callbackTimer = {};
	$scope.callbackTimer.finished = function() {
		$scope.query_liuhecai();
	};
	$scope.refresh = function() {
		$route.reload();
	};
	$scope.parse_code = function(code) {
		return parseFloat(code) < 10 ? "0" + code : code;
	};
	$scope.parse_code_1 = function(codes) {
		return codes.split("，").filter(function(c) {
			return c != ''
		});
	};
	// carom 连中
	$scope.game_code = [];
	for (var i = 1; i < 50; i++) {
		$scope.game_code.push({
			number: i,
			check: false
		});
	}
	$scope.toggle_board = function() {
		$scope.is_board_open = !$scope.is_board_open;
	}
	$scope.caroms = [];
	$scope.check_list = [];
	$scope.check = function(game) {
		var size = 3;
		if ($scope.input.game_type.value == 8) {
			size = 2;
		}
		if (game.check) {
			game.check = !game.check;
			$scope.check_list = $scope.check_list.filter(function(g) {
				return g != game;
			})
			return;
		}
		game.check = true;
		$scope.check_list.push(game);
		if ($scope.check_list.length > size - 1) {
			$scope.caroms.push({
				id: new Date().getTime(),
				numbers: $scope.check_list,
				money: ""
			});
			$scope.check_list = [];
			$scope.game_code.map(function(code) {
				code.check = false;
				return code;
			});
			// $scope.toggle_board();
		}
	}
	$scope.remove = function(game) {
		$scope.caroms = $scope.caroms.filter(function(g) {
			return g.id != game.id;
		})
	};
	// reset form
	$scope.resetForm = function() {
		if ($scope.liuhecai.waiting) {
			return;
		}
		if ($scope.input.game_type.value < 6) {
			angular.forEach($scope.games, function(game, index) {
				angular.forEach(game.oIndexBeans, function(g, i) {
					g.betting_money = "";
					g.betted = false;
				})
			});
			return;
		}
		if ($scope.input.game_type.value > 5) {
			$scope.caroms = [];
		}
	};
	// ajax form
	$scope.ajaxForm = function() {
		if ($scope.liuhecai.waiting) {
			return;
		}
		var buy_infos = "",
			total_money = 0;
		if ($scope.input.game_type.value < 6) {
			var _t = $scope.query_1_5_buyinfos();
			buy_infos = _t.buy_infos;
			total_money = _t.total_money;

		}
		if ($scope.input.game_type.value > 5) {
			var _t = $scope.query_6_8_buyinfos();
			buy_infos = _t.buy_infos;
			total_money = _t.total_money;
		}
		toastServices.show();
		userServices.betting_liuhecai({
			"game_type": 4,
			"o_type": $scope.input.game_type.value,
			"total_money": total_money,
			"n_periods_next": $scope.liuhecai.qishu_next,
			"buy_infos": buy_infos,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				// $timeout(function() {
				// 	$route.reload();
				// }, 500)
				$scope.resetForm();
				$scope.query_liuhecai();
			} else {
				errorServices.autoHide(data.message);
			}
		})

	}
	$scope.query_1_5_buyinfos = function() {
		var buy_infos = "",
			total_money = 0;
		angular.forEach($scope.games, function(game, index) {
			angular.forEach(game.oIndexBeans, function(g, i) {
				if (g.betting_money) {
					// var _index = index + 1;
					total_money += parseFloat(g.betting_money);
					buy_infos += $scope.input.game_type.value + "A" + g.name + "A" + g.betting_money + "A" + g.rate + "#";
				}
			})
		});
		buy_infos = buy_infos.substring(0, buy_infos.length - 1);
		return {
			buy_infos: buy_infos,
			total_money: total_money
		}
	}
	$scope.query_6_8_buyinfos = function() {
		var buy_infos = "",
			total_money = 0;
		angular.forEach($scope.caroms, function(carom, index) {
			total_money += parseFloat(carom.money);
			var carom_str = carom.numbers.map(function(c) {
				if (c.number < 10) {
					return "0" + c.number;
				}
				return c.number;
			}).join("B");
			buy_infos += $scope.input.game_type.value + "A" + carom_str + "A" + carom.money + "A" + $scope.games[0].oIndexBeans[0].rate + "#";

		});
		buy_infos = buy_infos.substring(0, buy_infos.length - 1);
		return {
			buy_infos: buy_infos,
			total_money: total_money
		}
	}
})