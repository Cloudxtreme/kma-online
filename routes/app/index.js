var Promise = require('bluebird');
var Models  = require('../../models')

var index = {
	index: function (req, res) {
		res.render('app/index');
	},
	
	clients: require('./clients.js')
};

module.exports = index;