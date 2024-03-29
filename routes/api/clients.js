var Models  = require('../../models');
var Promise = require('bluebird');

var clients = {
	
	getOne: function (req, res) {
		var clientId = req.params.id;
		
		console.log('ClientID: ', clientId);
		
		Promise.resolve(Models.Client.findOne({ _id: clientId }).exec())
			.then(function (client) {
				return res.json(client);
			});
	},
	
	getAll: function (req, res) {
		Promise.resolve(Models.Client.find().exec())
			.then(function (clients) {
				return res.json(clients);
			});
	},
	
	create: function (req, res) {
		var client = req.body;
		console.log('creating client:', client);
		Promise.resolve(Models.Client.create(client))
			.then(function (numCreated){
				return res.send("successfully created " + numCreated + " client(s).");		
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
		var nClient = req.body;
		
		console.log('updating client with id of ' + id);
		
		Promise.resolve(Models.Client.findOne({ _id: id }).exec())
			.then(function (dbClient) {
				dbClient.name    = nClient.name;
				dbClient.company = nClient.company;
				dbClient.email   = nClient.email;
				dbClient.phone   = nClient.phone;
				dbClient.addr1   = nClient.addr1;
				dbClient.addr2   = nClient.addr2;
				dbClient.city    = nClient.city;
				dbClient.state   = nClient.state;
				dbClient.zip     = nClient.zip;
				return Promise.resolve(dbClient.save());
			})
			.then(function (updatedClient) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Bad things:', err);
				res.status(400).send('Error updating client :(');
			});
	}
	
};

module.exports = clients;