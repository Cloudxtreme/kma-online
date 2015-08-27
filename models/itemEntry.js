var Promise               = require('bluebird'),
    mongoose 			  = require('mongoose'),
	autoIncrement 		  = require('mongoose-auto-increment'),
	Schema 				  = mongoose.Schema;
 
var ItemEntrySchema = new Schema({
	_invoice: { type: Number, required: true,  ref: "Invoice" },
	category: { type: String, required: true,  index: { unique: false } },
	subcat:   { type: String, required: false },
	date:     { type: Date,   required: false },
	source:   { type: String, required: false },
	memo:     { type: String, required: false },
	rate:     { type: Number, required: true, default: 0 },
	qty:      { type: Number, required: true, default: 1 }
});

ItemEntrySchema.methods.getDateString = function () {
	var date = this.date;
	
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
};

ItemEntrySchema.plugin(autoIncrement.plugin, 'ItemEntry');

module.exports = mongoose.model('ItemEntry', ItemEntrySchema);
