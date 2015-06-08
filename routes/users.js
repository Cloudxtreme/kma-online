var Models  = require('../models');
var Promise = require('bluebird');

var users = {
	
	getOne: function (req, res) {
		var userId = req.params.id;
		
		console.log('UserId: ', userId);
		
		Promise.resolve(Models.User.findOne({ _id: userId }).exec())
			.then(function (user) {
				res.json(user);
			});
	}
	
};

module.exports = users;