var Promise = require('bluebird');
var Models  = require('../../models')

var projects = {
	index: function (req, res) {
		var clientId = req.params.clientId;
		Promise.resolve(Models.Client.findOne({ _id: clientId })
			.populate('projects')
			.exec())
			.then(function (client) {
				console.log('client:', client);
				return res.render('app/projects/projects.jade', { client: client });
			});
	},
	
	add: function (req, res) {
		return res.render('app/projects/project-add.jade', { clientId: req.params.clientId, project: null });
	}//,
//	
//	edit: function (req, res) {
//		Promise.resolve(Models.Client.findOne({ _id: req.params.id }).exec())
//			.then(function (client) {
//				return res.render('app/clients/client-add.jade', { client: client });
//			});
//	}
};

module.exports = projects;