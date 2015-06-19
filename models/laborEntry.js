var Promise               = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	Schema 				  = mongoose.Schema;
 
var LaborEntrySchema = new Schema({
	_invoice: { type: Number, required: true,  ref: "Invoice" },
	name:     { type: String, required: true,  index: { unique: false } },
    worker:   { type: Number, required: true },
	rate:     { type: Number, required: false, default: 0 },
	hours:    { type: Number, required: false, default: 0 }
});

LaborEntrySchema.plugin(autoIncrement.plugin, 'LaborEntry');

module.exports = mongoose.model('LaborEntry', LaborEntrySchema);