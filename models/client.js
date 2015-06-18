var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
 
var ClientSchema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    company: { type: String, required: false },
	email: { type: String, required: false },
	phone: { type: Number, required: false },
	addr1: { type: String, required: false },
	addr2: { type: String, required: false },
	city: { type: String, required: false },
	state: { type: String, required: false },
	zip: { type: Number, required: false },
	projects: [{ type: Schema.Types.Number, ref: 'Project' }]
});

ClientSchema.methods.getPhoneString = function() {
	var client = this;
	
	var phoneString = "" + client.phone;
  	var formated = phoneString.match(/^(\d{3})(\d{3})(\d{4})$/);
  	return (!formated) ? null : "(" + formated[1] + ") " + formated[2] + "-" + formated[3];
};

ClientSchema.methods.getAddressShort = function() {
	var client = this;
	
	var addr = "";
	addr += client.addr1 ? client.addr1 : "";
	addr += client.addr2 && client.addr1 ? " " : "";
	addr += client.addr2 ? client.addr2 : "";
	addr += client.city || client.state || client.zip ? ", " : ""
	addr += client.city ? client.city : "";
	addr += client.city ? (client.state ? ", " : " ") : "";
	addr += client.state ? client.state + " " : "";
	addr += client.zip ? client.zip : "";
	
	return addr;
};

ClientSchema.plugin(autoIncrement.plugin, 'Client');
ClientSchema.plugin(createdModifiedPlugin, { index: true });

module.exports = mongoose.model('Client', ClientSchema);