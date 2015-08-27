var Promise 			  = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin,
	Schema 				  = mongoose.Schema;
 
var InvoiceSchema = new Schema({
	_client:     { type: Number,  required: true,  ref: "Client" },
	_project:    { type: Number,  required: true,  ref: "Project" },
    date:        { type: Date,    required: true,  default: Date.now },
    invoiceNum:  { type: Number,  required: true,  index: { unique: true } },
	op:          { type: Number,  required: false, default: 0, get: getDecimal, set: setDecimal }, // Overhead and profit, stored as float [0-1)
	sv: 		 { type: Number,  required: false, default: 0, get: getDecimal, set: setDecimal }, // Cost for supervision
	paid: 	     { type: Boolean, required: false, default: false },
	labor:      [{ type: Number,  required: false, ref: "LaborEntry" }],
	items:      [{ type: Number,  required: false, ref: "ItemEntry"  }],
	addItems:   [{ type: Number,  required: false, ref: "ItemEntry"  }],
    workers:    [{ type: Number,  required: false, ref: "Worker"     }]
});

InvoiceSchema.index({ _project: 1, date: 1 }, { unique: true });

InvoiceSchema.methods.getDateString = function () {
	var date = this.date;
	
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
};

InvoiceSchema.methods.getOPString = function () {
	var invoice = this;
	if (isNaN(invoice.op)) return "0.00%";
	var opString = '' + (100.0 * invoice.op).toFixed(2) + '%';
  	return opString;
};

InvoiceSchema.methods.getSVString = function () {
	var invoice = this;
	if (isNaN(invoice.sv)) return "$0.00";
	var svString = '$' + invoice.sv.toFixed(2);
  	return svString;
};

function getDecimal(v) {
	return parseFloat((v / 100.0).toFixed(2));
}

function setDecimal(v) {
	return parseFloat(v.toString(2)) * 100;
}

InvoiceSchema.plugin(autoIncrement.plugin, 'Invoice');
InvoiceSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);