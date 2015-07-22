var Models  = require('../../models');
var Promise = require('bluebird');
var xlsx    = require('xlsx');
var fs 		= require('fs');

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
		console.log(req.body);
		var invoice_data = req.body;
		
		console.log('invoice data:', invoice_data);
		
		var workbook = xlsx .readFile(invoice_data.wbPath);
		var laborEntries = parseLaborData(workbook.Sheets[invoice_data.laborSheet]);
		var itemEntries  = parseItemData(workbook.Sheets[invoice_data.itemsSheet]);
		
		if (!laborEntries || !itemEntries) {
			console.error('Unable to parse workbook.');
			return res.status(400).send("Unable to parse workbook.");
		}
		
		//parse xl file here.
		
		var project = null;
		var invoice = new Models.Invoice(invoice_data);
		
		Promise.resolve(Models.Project.findOne( { _id: invoice._project }))
			.then(function (dbProject) {
				project = dbProject;
				return Promise.resolve(invoice.save());
			})
			.then(function (result) {
				// Add the invoice to the project's invoice references
				project.invoices.push(invoice._id);
				return Promise.resolve(project.save());
			})
			.then(function (result) {
				return createLaborEntries(laborEntries, invoice, project._id);
			})
			.then(function (result) {
				return createItemEntries(itemEntries, invoice);	
			})
			.then(function (result) {
				fs.unlink(invoice_data.wbPath);
				return res.send("successfully created the invoice.");
			})
			.catch(function (err) {
				if (invoice_data.wbPath)
					try {
						fs.unlink(invoice_data.wbPath);
					} catch (err) { }
					
				if (invoice._id)
					Models.Invoice.remove({ _id: invoice._id });
					
				console.log('Error creating invoice.', err);
				if (!err) return res.send('Unexpected error occurred.');
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate invoice was found!");
				
				return res.status(400).send("Unknown Error Occurred.");
			});	
	},
	
	update: function (req, res) {
		var id = req.body._id;
		console.log('updating invoice with id of ' + id);
		
		Promise.resolve(Models.Invoice.findOne({ _id: id }).exec())
			.then(function (dbInvoice) {
				dbInvoice.date = req.body.date;
				dbInvoice.sv = req.body.sv;
				dbInvoice.op = req.body.op;
				console.log('saving project');
				return Promise.resolve(dbInvoice.save());
			})
			.then(function (updatedProject) {
				res.status(200).send('Success');
			})
			.catch(function (err) {
				console.error('Error updating invoice:', err);
				
				if (err.code == 11000)
					return res.status(400).send("A duplicate invoice was found!");
				
				res.status(400).send('Error updating invoice.');
			});
	}
	
};

/*
 * Parses the information grabbed from the Labor excel worksheet
 * and creates objects for each entry. These objects will be turned
 * into LaborEntry items in the database.
 */
function parseLaborData (ws) {
	var laborEntries = [];
	var currWorker = null;
	var currEntry = {};
	
	var col_name  = 'B',
	    col_item  = 'C',
		col_hours = 'D';
	
	for (var z in ws) {
		if (z[0] === '!') continue;
		
		if (("" + ws[z].v).indexOf('Total') != -1) {
			currWorker = null;
			continue;
		}
		
		// Column 'B' is the worker's name
	    if (z.indexOf(col_name) == 0){
			currWorker = ws[z].v.trim().toLowerCase(); 
	    }

    	if (!currWorker)
      		continue;

    	// Column 'C' is the name of the item.
    	if (z.indexOf(col_item) == 0){
      		currEntry.name = ws[z].v.trim(); 
    	}
    
	    // Column 'D' is the amount of hours.
	    if (z.indexOf(col_hours) == 0){
	      currEntry.hours = ws[z].v;
		  currEntry.workerName = currWorker;
	      laborEntries.push(currEntry);
		  
	      currEntry = {};
	    }
  	}

	console.log('laborEntries:', laborEntries.length);
	var hours = 0;
	for (var entry in laborEntries)
		hours += laborEntries[entry].hours;
	console.log('hours: ' + hours);
  	return laborEntries;
}

function createLaborEntries (laborEntries, invoice, projectId) {
	console.log('Creating labor db entries.');
	var workerHash = [];
	var workerPromises = [];
	var promises = [];
	
	laborEntries.forEach(function (entry) {
		if (!workerHash[entry.workerName]) {
			workerHash[entry.workerName] = entry.workerName;
			
			workerPromises.push(
				Promise.resolve(Models.Worker.findOne({ name: entry.workerName, _project: projectId }).exec())
				.then(function (worker) {
					if (worker) {
                        console.log('found existing worker: ', worker); 
                        return worker;
                    }
					
					// Worker doesn't exist, create new one.
					var newWorker = new Models.Worker({
						_project: projectId,
						name: entry.workerName
					});
					return Promise.resolve(newWorker.save());
				})
				.catch(function (err) {
					console.log('Error creating worker:', err);
				})
			);
		}
	});
	
	return Promise.all(workerPromises)
		.then(function (workerResults) {
			laborEntries.forEach(function (entry) {
				// Find the worker in the database for this entry.
				promises.push(
					Promise.resolve(Models.Worker.findOne({ name: entry.workerName, _project: projectId }).exec())
					.then(function (worker) {
						if (!worker) throw new Error("Unable to find or generate worker!!");
						entry.rate = worker.wage || 0;
						entry.worker = worker._id;
						entry._invoice = invoice._id;
						var laborEntry = new Models.LaborEntry(entry);
						return Promise.resolve(laborEntry.save());
					})
					.then(function (laborEntry) {
						invoice.labor.push(laborEntry._id);
						return true;
					})
					.catch(function (err) {
						console.error(err);
						return false;
					})
				);
			});
		
			return Promise.all(promises);
		})
		.then(function (results) {
			return Promise.resolve(invoice.save());
		})
		.then(function (results) {
			console.log('Finished creating labor entries.');
			return true;
		});
	
}

function parseItemData (ws) {
    console.log('PARSING ITEMS');
	var itemEntries = [];
  	var currCat 	= null;
  	var currSubCat 	= null;
	var itemEntry 	= new Models.ItemEntry();

	var col_cat		= 'C',
		col_sub		= 'D',
		col_date 	= 'F',
      	col_source 	= 'G',
      	col_memo 	= 'H',
      	col_amount 	= 'I';
		  	
	for (var z in ws) {
		if (z[0] === '!') continue;
        
        console.log(z);

    	//Total for the main category
    	if (z.indexOf(col_cat) == 0) {
      		if (ws[z].v.indexOf('Total') == 0) {
        		currCat = null;
        		currSubCat = null;
        		continue;
      		}

	      	currCat = ws[z].v.trim().replace(/\./g, '_');
            console.log('currCat: ' +  currCat);
	      	//itemEntry = new Models.ItemEntry();
			itemEntry.category = currCat;
	    }

		if (!currCat) continue;
		
    	if (z.indexOf(col_sub) == 0){
      		if (ws[z].v.trim().indexOf('Total') == 0) {
        		currSubCat = null;
        		continue;
      		}
			  
	    	currSubCat = ws[z].v.trim();
	      	itemEntry.subcat = currSubCat;
    	}

    	if (z.indexOf(col_date) == 0){
      		var date = new Date(Math.round((ws[z].v - 25568)*86400*1000));
      		itemEntry.date = date;
   	 	}

    	if (z.indexOf(col_source) == 0){
      		itemEntry.source = ws[z].v.trim();
    	}

    	if (z.indexOf(col_memo) == 0){
      		itemEntry.memo = ws[z].v.trim();
    	}

    	if (z.indexOf(col_amount) == 0){
      		itemEntry.rate = parseFloat(ws[z].v);
      		if (itemEntry.date && itemEntry.rate){
        		itemEntries.push(itemEntry);
      		}
      		itemEntry = new Models.ItemEntry();
      		if (currSubCat)
        		itemEntry.subcat = currSubCat;
			if (currCat)
				itemEntry.category = currCat;
    	}
  	}

	console.log('itemEntries:', itemEntries.length);
	var cost = 0;
	for (var item in itemEntries) 
		cost += itemEntries[item].rate;
	console.log('cost: $' + cost);
	
  	return itemEntries;
}

function createItemEntries (itemEntries, invoice) {
	console.log('Creating item db entries.');
	var promises = [];
	
	itemEntries.forEach(function (entry) {
		// Find the worker in the database for this entry.
		var itemEntry = new Models.ItemEntry(entry);
		itemEntry._invoice = invoice._id;
		
		promises.push(
			Promise.resolve(itemEntry.save())
			.then(function (result) {
				invoice.items.push(itemEntry._id);
				return true;
			})
			.catch(function (err) {
				console.error(err);
				return false;
			})
		);
	});
	
	return Promise.all(promises)
		.then(function (results) {
			return Promise.resolve(invoice.save());
		})
		.then(function (results) {
			console.log('Finished creating item entries.');
			return true;
		});
}

module.exports = invoices;