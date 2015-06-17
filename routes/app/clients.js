var Promise = require('bluebird');
var Models  = require('../../models')

var clients = {
	index: function (req, res) {
		Promise.resolve(Models.Client.find().exec())
			.then(function (clients) {
				return res.render('app/clients/clients.jade', { clients: clients });
			});
	},
	
	add: function (req, res) {
		return res.render('app/clients/client-add.jade');
	},
	
	edit: function (req, res) {
		Promise.resolve(Models.Client.findOne({ _id: req.params.id }).exec())
			.then(function (client) {
				return res.render('app/clients/client-add.jade', { client: client });
			});
	}
};

module.exports = clients;