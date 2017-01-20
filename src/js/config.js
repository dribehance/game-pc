angular.module("Game").constant("config", {
	url: "http://www.lczx1396.hk",
	imageUrl: "http://www.lczx1396.hk/files/image?name=",
	request: {
		"SUCCESS": "200",
		"TOKEN_INVALID": "405"
	},
	response: {
		"SUCCESS": 1
	},
	common_params: {
		invoke: "h5"
	},
	interceptor: [
		"index",
		"feiting",
		"saiche",
		"kuaile",
		"liuhecai",
		"jiangpin",
		"contact",
		"charge",
		"me",
		"bills",
		"recommandors",
		"recommand_income",
		"my_code",
		"forget",
		"modify_password",
		"modify_trade_password",
		"messages",
		"online_charge",
		"online_withdraw",
		"fillinorder",
		"detail",
		"exchange",
		"orders",
		// "signin",
		"signup",
		"fillinorder_feiting",
		"fillinorder_saiche",
		"fillinorder_kuaile",
		"fillinorder_liuhecai",
		"config",
	]
});