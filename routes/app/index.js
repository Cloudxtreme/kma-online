var Promise = require('bluebird');
var Models  = require('../../models')

var index = {
	index: function (req, res) {
		res.render('app/index');
	},
	
	clients: function (req, res) {
		Promise.resolve(Models.Client.find().exec())
			.then(function (clients) {
				return res.render('app/clients/clients.jade', { clients: clients });
			});
	}
};

module.exports = index;