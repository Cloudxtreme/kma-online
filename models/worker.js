var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
 
var WorkerSchema = new Schema({
	_project: { type: Number, required: true, ref: "Project" },
    name: { type: String, required: true, index: { unique: true } },
    wage: { type: Number, required: false }
});

WorkerSchema.plugin(autoIncrement.plugin, 'Worker');
WorkerSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Worker', WorkerSchema);