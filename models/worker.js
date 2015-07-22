var Promise 			  = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
    createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin,
	Schema 				  = mongoose.Schema;
 
var WorkerSchema = new Schema({
	_project: { type: Number, required: true,  ref: "Project" },
    _invoice: { type: Number, required: true,  ref: "Invoice" },
    name:     { type: String, required: true },
    billable: { type: Number, required: false, default: 0 },
    wage:     { type: Number, required: false, default: 0 }
});

WorkerSchema.index({_invoice: 1, name: 1}, {unique: true});

WorkerSchema.pre('save', function(next) {
	var user = this;
	
	//make sure all db entries get put in as lower case.
	user.name = user.name.toLowerCase();
	next();
});

WorkerSchema.plugin(autoIncrement.plugin, 'Worker');
WorkerSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Worker', WorkerSchema);