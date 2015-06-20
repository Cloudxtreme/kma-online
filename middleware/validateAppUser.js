var querystring = require("querystring");

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  else {
	console.log(req.originalUrl);
	var redir = querystring.stringify({redirect:req.originalUrl});
  	return res.redirect('/app/login?'+redir);//?redirect=' + req.url
  }
};