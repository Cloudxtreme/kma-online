var Promise = require('bluebird');
var Models  = require('../../models')
var Utils  = require('../../modules/utils.js')

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
					.populate({ path: 'labor', options: { sort: { 'worker'  : 1 } } })
					.populate({ path: 'items', options: { sort: { 'category': 1 } } })
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
	},
	
	overview: function (req, res) {
		var laborTotal = 0,
			itemsTotal = 0,
            addItemsTotal = 0,
            subtotal = 0,
            op = 0,
            grandTotal = 0,
			id = req.params.id,
            clientId = req.params.clientId;
            
        var invoice = null;
		
		Promise.resolve(Models.Invoice.findOne({ _id: id })
			.populate({ path: 'labor',    options: { sort: { 'worker'   : 1 } } })
			.populate({ path: 'items',    options: { sort: { 'category' : 1 } } })
            .populate({ path: 'addItems', options: { sort: { 'category' : 1 } } })
            .populate({ path: 'workers',  options: { sort: { 'name'     : 1 } } })
			.exec())
            .then(function (dbInvoice) {
                var options = {
                    path: 'labor.worker',
                    model: 'Worker'
                };
            
                // Populate workers.
                return Promise.resolve(Models.Invoice
                    .populate(dbInvoice, options));
            })
			.then(function (dbInvoice) {
                invoice = dbInvoice;
				laborTotal = getLaborTotal(invoice.labor, invoice.workers);
				itemsTotal = getItemsTotal(invoice.items);
                addItemsTotal = getItemsTotal(invoice.addItems);
                subtotal = (laborTotal + itemsTotal + addItemsTotal + invoice.sv);
                op = (invoice.op * subtotal);
                grandTotal = subtotal + op;
                
                var workerTotals = getWorkerTotals(invoice.labor);
                
				return res.render('app/invoices/pages/overview.jade', {
                    clientId       : clientId,
					invoice        : invoice,
					laborTotal     : Utils.formatMoney(laborTotal),
					itemsTotal     : Utils.formatMoney(itemsTotal),
                    addItemsTotal  : Utils.formatMoney(addItemsTotal),
                    supervision    : Utils.formatMoney(invoice.sv),
                    subtotal       : Utils.formatMoney(subtotal),
                    op             : Utils.formatMoney(op),
                    grandTotal     : Utils.formatMoney(grandTotal),
                    workerTotals   : workerTotals
				});
			});
	},
	
	items: function (req, res) {
		var id = req.params.id;
		
		Promise.resolve(Models.Invoice.findOne({ _id: id })
			.populate({ path: 'items', options: { sort: { 'category': 1 } } })
			.exec())
			.then(function (invoice) {
				return res.render('app/invoices/pages/items.jade', {
					invoice: invoice
				});
			});
	},
    
    addItems: function (req, res) {
		var id = req.params.id;
		
		Promise.resolve(Models.Invoice.findOne({ _id: id })
			.populate({ path: 'addItems', options: { sort: { 'category': 1 } } })
			.exec())
			.then(function (invoice) {
				return res.render('app/invoices/pages/addItems.jade', {
					invoice: invoice
				});
			});
	},
    
    labor: function (req, res) {
        var id = req.params.id;
        var dbInvoice;
        
        Promise.resolve(Models.Invoice.findOne({ _id: id })
			.populate({ path: 'labor',   options: { sort: { 'worker': 1, 'name': 1 } } })
            .populate({ path: 'workers', options: { sort: { 'name'  : 1 } } })
			.exec())
			.then(function (invoice) {
                var options = {
                    path: 'labor.worker',
                    model: 'Worker'
                };
            
                // Populate workers.
                return Promise.resolve(Models.Invoice
                    .populate(invoice, options));
			})
            .then(function (invoice) {
                dbInvoice = invoice;
                return res.render('app/invoices/pages/labor.jade', {
					invoice: dbInvoice,
                    workers: invoice.workers
				});
            })
    },
    
    workers: function(req, res) {
        var id = req.params.id;
        
        Promise.resolve(Models.Worker.find({ _invoice: id }))
			.then(function (workers) {
                return res.render('app/invoices/pages/workers.jade', {
                    projectId: id,
                    workers: workers
				});
            });
    }
};

function getLaborTotal(laborData) {
    var total = 0;
    for (var i = 0; i < laborData.length; i++)
        total += laborData[i].worker.billable * laborData[i].hours;
    return parseFloat(total.toFixed(2));
}

function getItemsTotal(itemsData) {
	var total = 0;
	for (var i = 0; i < itemsData.length; i++)
		total += itemsData[i].rate * itemsData[i].qty;
	return parseFloat(total.toFixed(2));
}

function getWorkerTotals(laborData) {
    var workers = {};
    for (var i = 0; i < laborData.length; i++) {
        var workerId = laborData[i].worker._id;
        if (!workers[workerId]) {
            workers[workerId] = laborData[i].worker;
            workers[workerId].hoursWorked = 0.0;
        }
            
        workers[workerId].hoursWorked += laborData[i].hours;
    }
    
    return workers;
}

module.exports = invoices;