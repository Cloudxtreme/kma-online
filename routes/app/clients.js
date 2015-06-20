var Promise = require('bluebird');
var Models  = require('../../models')

var clients = {
	all: function (req, res) {
		Promise.resolve(Models.Client.find()
			.sort({'modified':-1}).exec())
			.then(function (clients) {
				return res.render('app/clients/clients.jade', { clients: clients });
			});
	},
	
	single: function (req, res) {
		var clientId = req.params.id;
		Promise.resolve(Models.Client.findOne({ _id: clientId })
			.populate({path:'projects', options:{sort:{'modified':-1}}})
			.exec())
			.then(function (client) {
				if (!client) throw new Error("Unable to load client with id: " + clientId);
				return res.render('app/clients/client.jade', { client: client });
			})
			.catch(function (err) {
				res.status(401).send("Can't find client");
			});
	},
	
	add: function (req, res) {
		return res.render('app/clients/client-add.jade', { client: null });
	},
	
	edit: function (req, res) {
		Promise.resolve(Models.Client.findOne({ _id: req.params.id }).exec())
			.then(function (client) {
				return res.render('app/clients/client-add.jade', { client: client });
			});
	}
};

module.exports = clients;