var Models  = require('../../models');
var Promise = require('bluebird');

var invoices = {
	
	getOne: function (req, res) {
		var id = req.params.id;
		
		console.log('Invoice ID: ', id);
		
		Promise.resolve(Models.Invoice.findOne({ _id: id }).exec())
			.then(function (invoice) {
				return res.json(invoice);
			});
	},
	
	getAll: function (req, res) {
		Promise.resolve(Models.Invoice.find().exec())
			.then(function (invoices) {
				return res.json(invoices);
			});
	},
	
	create: function (req, res) {
		var invoice_data = req.body;
		var project = null;
		var invoice = new Models.Project(invoice_data);
		
		Promise.resolve(Models.Project.findOne( {_id: invoice._project }))
			.then(function (dbProject) {
				project = dbProject;
				return Promise.resolve(invoice.save());	
			})
			.then(function (result) {
				// Add the project to the client's project references
				project.invoices.push(invoice._id);
				return Promise.resolve(project.save());
			})
			.then(function (result) {
				return res.send("successfully created " + result + " invoice(s).");
			})
			.catch(function (err) {
				if (!err) return res.send('Unexpected error occurred.');
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate entry was found!");
				
				console.error(err);	
				return res.status(400).send("Unknown Error Occurred.");
			});	
	},
	
//	update: function (req, res) {
//		var id = req.body._id;
//		console.log('updating project with id of ' + id);
//		
//		Promise.resolve(Models.Project.findOne({ _id: id }).exec())
//			.then(function (dbProject) {
//				dbProject.name = req.body.name;
//				dbProject.location = req.body.location;
//				dbProject.op = req.body.op;
//				console.log('saving project');
//				return Promise.resolve(dbProject.save());
//			})
//			.then(function (updatedProject) {
//				res.status(200).send('Success');
//			})
//			.catch(function (err) {
//				console.error('Bad things:', err);
//				res.status(400).send('Error updating project :(');
//			});
//	}
	
};

module.exports = invoices;