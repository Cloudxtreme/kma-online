var Models  = require('../../models');
var Promise = require('bluebird');

var projects = {
	
	getOne: function (req, res) {
		var projectId = req.params.id;
		
		console.log('ProjectId: ', projectId);
		
		Promise.resolve(Models.Project.findOne({ _id: projectId }).exec())
			.then(function (project) {
				return res.json(project);
			});
	},
	
	getAll: function (req, res) {
		Promise.resolve(Models.Project.find().exec())
			.then(function (projects) {
				return res.json(projects);
			});
	},
	
	create: function (req, res) {
		var project_data = req.body;
		var client = null;
		var project = new Models.Project(project_data);
		
		Promise.resolve(Models.Client.findOne( {_id: project._client }))
			.then(function (dbClient) {
				client = dbClient;
				return Promise.resolve(project.save());	
			})
			.then(function (result) {
				// Add the project to the client's project references
				client.projects.push(project._id);
				return Promise.resolve(client.save());
			})
			.then(function (result) {
				return res.send("successfully created " + result + " project(s).");
			})
			.catch(function (err) {
				if (!err) return res.send('Unexpected error occurred.');
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate entry was found!");
				
				console.error(err);	
				return res.status(400).send("Unknown Error Occurred.");
			});	
	},
	
	update: function (req, res) {
		var id = req.body._id;
		console.log('updating project with id of ' + id);
		
		Promise.resolve(Models.Project.findOne({ _id: id }).exec())
			.then(function (dbProject) {
				dbProject.name = req.body.name;
				dbProject.location = req.body.location;
				console.log('saving');
				return Promise.resolve(dbProject.save());
			})
			.then(function (updatedProject) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Bad things:', err);
				res.status(400).send('Error updating project :(');
			});
	}
	
};

module.exports = projects;