var Promise = require('bluebird');
var Models  = require('../../models')

var app = {
	index: function (req, res) {
        Promise.resolve(Models.Invoice.find({ paid: false }).exec())
        .then(function (invoices) {
            res.render('app/index', {
                invoices: invoices
            });            
        });
		
	},
	
	clients:  require('./clients.js'),
	projects: require('./projects.js'),
	invoices: require('./invoices.js'),
	utils:    require('./utils.js')
};

module.exports = app;