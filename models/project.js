var Promise 			  = require('bluebird'),
    mongoose 		 	  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin,
	Schema 				  = mongoose.Schema;
 
var ProjectSchema = new Schema({
	_client:   { type: Number,  required: true, ref: "Client" },
    name:      { type: String,  required: true, index: { unique: true } },
    location:  { type: String,  required: false },
	op:        { type: Number,  required: false }, // Overhead and profit, stored as float [0-1)
	isActive:  { type: Boolean, required: true },
	invoices: [{ type: Number,  required: false, ref: 'Invoice' }]
});

ProjectSchema.methods.getOPString = function() {
	var project = this;
	if (isNaN(project.op)) return "0.00%";
	var opString = '' + (100.0 * project.op) + '%';
  	return opString;
};

ProjectSchema.plugin(autoIncrement.plugin, 'Project');
ProjectSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Project', ProjectSchema);