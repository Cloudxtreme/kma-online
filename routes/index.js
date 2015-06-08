var express = require('express');
var router  = express.Router();

var auth    = require('./auth.js');
var user    = require('./users.js');
var app     = require('./app');

module.exports = function() {
  
  router.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });
  
  // Auth Middleware - This will check if the token is valid
  router.all('/api/v1/*', [require('../middleware/validateRequest')]);
	
  /* Public routes */
  router.get('/login', auth.displayLogin);
  
  /* Application routes */
  router.get('/app', app.index);
  
  /* API routes */
  router.get('/api/v1/user/:id', user.getOne);

  return router;
};
