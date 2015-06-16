var users = require('./users.js');
var client = require('./client.js')

var models = {
	User: users,
	Client: client
};

module.exports = models;