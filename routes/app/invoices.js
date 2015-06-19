var Promise = require('bluebird');
var Models  = require('../../models')

var invoices = {
//	single: function (req, res) {
//		var clientId = req.params.clientId;
//		var id       = req.params.id;
//		var client   = null;
//		
//		Promise.resolve(Models.Client.findOne({ _id: clientId })
//			.select('name').exec())
//			.then(function (dbClient){
//				if (!dbClient) throw new Error("Unable to find client[" + clientId + "] in database.");
//				
//				client = dbClient;
//				return Promise.resolve(Models.Project.findOne({ _id: id })
//					.populate({ path: 'invoices', options: { sort: { 'date': -1 } } })
//					.exec());
//			})
//			.then(function (project) {
//				if (!project) throw new Error("Unable to find project[" + id + "] in database");
//				
//				return res.render("app/projects/project.jade", {client: client, project: project});
//			})
//			.catch(function (err) {
//				res.status(400).send(err);
//			});
//	},
	
	add: function (req, res) {
		return res.render('app/invoices/invoice-add.jade', { 
			clientId: req.params.clientId, 
			projectId: req.params.projectId,
			invoice: null
		});
	},
	
	edit: function (req, res) {
		Promise.resolve(Models.Invoice.findOne({ _id: req.params.id }).exec())
			.then(function (invoice) {
				return res.render('app/invoices/invoice-add.jade', { 
					clientId: req.params.clientId,
					projectId: req.params.projectId,
					invoice: invoice 
				});
			});
	}
};

module.exports = invoices;