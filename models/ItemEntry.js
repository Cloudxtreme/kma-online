var Promise               = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	Schema 				  = mongoose.Schema;
 
var ItemEntrySchema = new Schema({
	_invoice: { type: Number, required: true,  ref: "Invoice" },
	name:     { type: String, required: true,  index: { unique: false } },
	category: { type: String, required: true,  index: { unique: false } },
	date:     { type: Date,   required: false },
	source:   { type: String, required: false },
	memo:     { type: String, required: false },
	rate:     { type: Number, required: false, default: 0 },
	qty:      { type: Number, required: false, default: 0 }
});

ItemEntrySchema.plugin(autoIncrement.plugin, 'ItemEntry');

module.exports = mongoose.model('ItemEntry', ItemEntrySchema);