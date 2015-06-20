var Promise 			  = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	Schema 				  = mongoose.Schema;
 
var WorkerSchema = new Schema({
	_project: { type: Number, required: true,  ref: "Project" },
    name:     { type: String, required: true,  index: { unique: true } },
    wage:     { type: Number, required: false, default: 0 }
});

WorkerSchema.pre('save', function(next) {
	var user = this;
	
	//make sure all db entries get put in as lower case.
	user.name = user.name.toLowerCase();
	next();
});

WorkerSchema.plugin(autoIncrement.plugin, 'Worker');

module.exports = mongoose.model('Worker', WorkerSchema);