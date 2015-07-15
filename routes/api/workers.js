var Models  = require('../../models');
var Promise = require('bluebird');
var xlsx    = require('xlsx');
var fs 		= require('fs');

var workers = {
	
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
		var entry = new Models.Worker(req.body);
        
    	console.log('creating worker entry:', entry);
        Promise.resolve(entry.save())
            .then(function (result) {
                return res.send("successfully created a new worker entry.");
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
		console.log('updating worker entry with id of ' + id);
        console.log(req.body);
		
		Promise.resolve(Models.Worker.findOne({ _id: id }).exec())
			.then(function (dbWorker) {
				dbWorker.name = req.body.name;
				dbWorker.wage = req.body.wage;
                dbWorker.billable = req.body.billable;
				console.log('saving worker entry.');
				return Promise.resolve(dbWorker.save());
			})
			.then(function (updatedWorker) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Error updating worker entry:', err);
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate worker entry was found!");
				
				return res.status(400).send('Error updating worker entry.');
			});
	},
    
    delete: function (req, res) {
        var id = req.params.id;
        console.log("Deleting worker entry with id of " + id);
        
        Promise.resolve(Models.Worker.remove({ _id: id }))
            .then(function (result) {
                if (res.n <= 0) throw new Error("Unable to find and delete worker entry.")
                
                res.send("Success!");
            })
            .catch(function (err) {
                console.error("Error deleting worker entry: " + id);
                console.error(err);
                
                return res.status(400).send("Error deleting worker entry.");
            })
    }
	
};

module.exports = workers;