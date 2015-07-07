var Models  = require('../../models');
var Promise = require('bluebird');
var xlsx    = require('xlsx');
var fs 		= require('fs');

var itemEntries = {
	
	// getOne: function (req, res) {
	// 	var id = req.params.id;
		
	// 	console.log('Invoice ID: ', id);
		
	// 	Promise.resolve(Models.Invoice.findOne({ _id: id }).exec())
	// 		.then(function (invoice) {
	// 			return res.json(invoice);
	// 		});
	// },
	
	// getAll: function (req, res) {
	// 	Promise.resolve(Models.Invoice.find().exec())
	// 		.then(function (invoices) {
	// 			return res.json(invoices);
	// 		});
	// },
    
    create: function (req, res) {
		var entry = new Models.ItemEntry(req.body);
        var invoice = null;
        
		console.log('creating item entry:', entry);
        Promise.resolve(Models.Invoice.findOne({ _id : entry._invoice }))
            .then(function (dbInvoice) {
                if (!dbInvoice) throw new Error("Unable to find invoice.");
                invoice = dbInvoice;
                
                return Promise.resolve(entry.save());  
            })
			.then(function (result) {
				// Add the project to the client's project references
				invoice.addItems.push(entry._id);
				return Promise.resolve(invoice.save());	
			})
            .then(function (result) {
                return res.send("successfully created a new item entry.");
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
		console.log('updating item entry with id of ' + id);
		
		Promise.resolve(Models.ItemEntry.findOne({ _id: id }).exec())
			.then(function (dbItemEntry) {
				dbItemEntry.category = req.body.category;
				dbItemEntry.subcat = req.body.subcat;
                dbItemEntry.source = req.body.source;
				dbItemEntry.memo = req.body.memo;
                dbItemEntry.rate = req.body.rate;
                dbItemEntry.qty = req.body.qty;
				console.log('saving item entry.');
				return Promise.resolve(dbItemEntry.save());
			})
			.then(function (updatedProject) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Error updating item entry:', err);
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate item entry was found!");
				
				return res.status(400).send('Error updating item entry.');
			});
	}
	
};

module.exports = itemEntries;