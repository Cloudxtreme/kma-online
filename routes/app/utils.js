var Promise = require('bluebird');
var Models  = require('../../models');
var excel   = require('xlsx');
var fs		= require('fs');

var utils = {
	wsSelector: function (req, res) {
		var workbook = null;
		var file = req.files.file;

		if (!file)
			return res.status(400).send("Unable to upload file.");

		try {
			workbook = excel.readFile(file.path);
			//fs.unlink(file.path);
			return res.render('app/invoices/sheet-picker.jade', {
				sheetNames: workbook.SheetNames,
				path: file.path
			});
		} catch (err) {
			console.error("Error loading file: ", err);
			fs.unlink(file.path);
			return res.send("Error loading worksheet.");
		}
	}
};

module.exports = utils;