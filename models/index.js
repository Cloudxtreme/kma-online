var users   = require('./users.js'  );
var client  = require('./client.js' );
var project = require('./project.js');
var worker  = require('./worker.js' );

var models = {
	User:    users,
	Client:  client,
	Project: project,
	Worker:  worker
};

module.exports = models;