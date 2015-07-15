var Models  = require('../../models');
var Promise = require('bluebird');
var xlsx    = require('xlsx');
var fs 		= require('fs');

var laborEntries = {
	
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
		var entry = new Models.LaborEntry(req.body);
        var invoice = null;
        
    	console.log('creating labor entry:', entry);
        Promise.resolve(Models.Invoice.findOne({ _id : entry._invoice }))
            .then(function (dbInvoice) {
                if (!dbInvoice) throw new Error("Unable to find invoice.");
                invoice = dbInvoice;
                
                return Promise.resolve(entry.save());  
            })
    		.then(function (result) {
        		// Add the labor entry to the invoices's labor references
                invoice.labor.push(entry._id);
                    
        		return Promise.resolve(invoice.save());	
    		})
            .then(function (result) {
                return res.send("successfully created a new labor entry.");
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
		console.log('updating labor entry with id of ' + id);
        console.log(req.body);
		
		Promise.resolve(Models.LaborEntry.findOne({ _id: id }).exec())
			.then(function (dbLaborEntry) {
				dbLaborEntry.name = req.body.name;
				dbLaborEntry.worker = req.body.worker;
                dbLaborEntry.hours = req.body.hours;
				console.log('saving labor entry.');
				return Promise.resolve(dbLaborEntry.save());
			})
			.then(function (updatedProject) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Error updating labor entry:', err);
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate labor entry was found!");
				
				return res.status(400).send('Error updating labor entry.');
			});
	},
    
    delete: function (req, res) {
        var id = req.params.id;
        console.log("Deleting labor entry with id of " + id);
        
        Promise.resolve(Models.LaborEntry.remove({ _id: id }))
            .then(function (result) {
                if (res.n <= 0) throw new Error("Unable to find and delete labor entry.")
                
                res.send("Success!");
            })
            .catch(function (err) {
                console.error("Error deleting labor entry: " + id);
                console.error(err);
                
                return res.status(400).send("Error deleting labor entry.");
            })
    }
	
};

module.exports = laborEntries;