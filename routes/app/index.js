var index = {
	index: function (req, res) {
		res.render('app/index');
	},
	
	clients: function (req, res) {
		res.render('app/clients/clients.jade');
	}
};

module.exports = index;