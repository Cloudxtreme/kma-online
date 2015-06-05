var express = require('express');
var router = express.Router();

module.exports = function() {
	
  /* GET home page. */
  router.get('/', function(req, res) {
    console.log('received request');
    res.render( 'index' );
  });

  return router;
};
