var Promise = require('bluebird');
var Models  = require('../../models')

var invoices = {
	single: function (req, res) {
		var clientId  = req.params.clientId;
		var projectId = req.params.projectId;
		var id        = req.params.id;
		var project   = null;
		
		Promise.resolve(Models.Project.findOne({ _id: projectId })
			.select('name _id').exec())
			.then(function (dbProject){
				if (!dbProject) throw new Error("Unable to find invoice[" + projectId + "] in database.");
				
				project = dbProject;
				return Promise.resolve(Models.Invoice.findOne({ _id: id })
					//.populate({ path: 'labor', options: { sort: { 'name': 1 } } })
					//.populate({ path: 'items', options: { sort: { 'category': 1 } } })
					.exec());
			})
			.then(function (invoice) {
				if (!invoice) throw new Error("Unable to find invoice[" + id + "] in database");
				
				return res.render("app/invoices/invoice.jade", {
					clientId: clientId,
					project: project, 
					invoice: invoice
				});
			})
			.catch(function (err) {
				console.error('Error in invoices.single:', err);
				res.status(400).send(err);
			});
	},
	
	add: function (req, res) {
		Promise.resolve(Models.Project.findOne({ _id: req.params.projectId }).exec())
			.then(function (dbProject){
				return res.render('app/invoices/invoice-add.jade', { 
					clientId: req.params.clientId, 
					project: dbProject,
					invoice: null
				});		
			})
			.catch(function (err) {
				return res.status(400).send("Unable to find project in invoice.add.");
			});
	},
	
	edit: function (req, res) {
		var project = null;
		var id = req.params.id;
		var projectId = req.params.projectId;
		var clientId = req.params.clientId;
		
		Promise.resolve(Models.Project.findOne({ _id: projectId }).exec())
			.then(function (dbProject) {
				project = dbProject;
				return Promise.resolve(Models.Invoice.findOne({ _id: id }).exec());
			})
			.then(function (invoice) {
				if (!invoice) throw new Error("Unable to find invoice[" + id + "] in invoice.edit.");
				if (!project) throw new Error("Unable to find invoice[" + projectId + "] in invoice.edit.");
				
				return res.render('app/invoices/invoice-add.jade', { 
					clientId: clientId,
					project: project,
					invoice: invoice 
				});
			})
			.catch(function (err) {
				console.error('Err:', err);
				return res.status(400).send(err);
			});
	}
};

module.exports = invoices;