var Promise 			  = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin,
	Schema 				  = mongoose.Schema;
 
var InvoiceSchema = new Schema({
	_client:   { type: Number,  required: true,  ref: "Client" },
	_project:  { type: Number,  required: true,  ref: "Project" },
    date:      { type: Date,    required: true,  default: Date.now, index: { unique: true } },
	op:        { type: Number,  required: false, default: 0 }, // Overhead and profit, stored as float [0-1)
	paid: 	   { type: Boolean, required: false, default: false },
	labor:    [{ type: Number,  required: false, ref: "LaborEntry" }],
	items:    [{ type: Number,  required: false, ref: "ItemEntry"  }],
	addItems: [{ type: Number,  required: false, ref: "ItemEntry"  }]
});

InvoiceSchema.methods.getDateString = function() {
	var date = this.date;
	
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
};

InvoiceSchema.plugin(autoIncrement.plugin, 'Invoice');
InvoiceSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);