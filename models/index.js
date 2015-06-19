var users   = require('./users.js'     );
var client  = require('./client.js'    );
var project = require('./project.js'   );
var worker  = require('./worker.js'    );
var invoice = require('./invoice.js'   );
var labor   = require('./LaborEntry.js');
var items   = require('./itemEntry.js' );

var models = {
	User:    	users,
	Client:  	client,
	Project: 	project,
	Worker:  	worker,
	Invoice: 	invoice,
	LaborEntry: labor,
	ItemEntry:  items
};

module.exports = models;