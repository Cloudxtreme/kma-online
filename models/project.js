var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
 
var ProjectSchema = new Schema({
	_client: { type: Number, required: true, ref: "Client" },
    name: { type: String, required: true, index: { unique: true } },
    location: { type: String, required: false },
	isActive: { type: Boolean, required: true },
});

ProjectSchema.plugin(autoIncrement.plugin, 'Project');

module.exports = mongoose.model('Project', ProjectSchema);