var Promise = require('bluebird');
var Models  = require('../../models')

var projects = {
	index: function (req, res) {
		var clientId = req.params.clientId;
		Promise.resolve(Models.Client.findOne({ _id: clientId })
			.populate({path:'projects', options:{sort:{'modified':-1}}})
			.exec())
			.then(function (client) {
				console.log('client:', client);
				return res.render('app/projects/projects.jade', { client: client });
			});
	},
	
	add: function (req, res) {
		return res.render('app/projects/project-add.jade', { clientId: req.params.clientId, project: null });
	},
	
	edit: function (req, res) {
		Promise.resolve(Models.Project.findOne({ _id: req.params.id }).exec())
			.then(function (project) {
				return res.render('app/projects/project-add.jade', { clientId: req.params.clientId, project: project });
			});
	}
};

module.exports = projects;