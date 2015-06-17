var users = require('./users.js');
var client = require('./client.js');
var project = require('./project.js');

var models = {
	User: users,
	Client: client,
	Project: project
};

module.exports = models;