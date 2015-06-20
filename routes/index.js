var multer   = require('multer');
var express  = require('express');
var router   = express.Router();

var auth     = require('./auth.js');
var users    = require('./api/users.js');
var clients  = require('./api/clients.js');
var projects = require('./api/projects.js');
var invoices = require('./api/invoices.js');
var app      = require('./app');

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
  router.get('/app/login', auth.displayLogin);
  
  /* Application routes */
  router.get('/app', app.index);
  router.get('/app/logout', auth.logoutApp);
  router.get('/app/clients', app.clients.all);
  router.get('/app/clients/add', app.clients.add);
  router.get('/app/clients/:id', app.clients.single);
  router.get('/app/clients/:id/edit', app.clients.edit);
  
  router.get('/app/clients/:clientId/projects/add', app.projects.add);
  router.get('/app/clients/:clientId/projects/:id', app.projects.single);
  router.get('/app/clients/:clientId/projects/:id/edit', app.projects.edit);
  
  router.get('/app/clients/:clientId/projects/:projectId/invoices/add', app.invoices.add);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id', app.invoices.single);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/edit', app.invoices.edit);
  
  router.use('/app/utils/ws-selector', multer({
    dest: "./uploads/"
  }));
  router.post('/app/utils/ws-selector', app.utils.wsSelector);
  
  /* API routes */
  router.get('/api/v1/user/:id', users.getOne);
  
  router.get('/api/v1/clients/:id', clients.getOne);
  router.get('/api/v1/clients', clients.getAll);
  router.post('/api/v1/clients', clients.create);
  router.put('/api/v1/clients', clients.update);
  
  router.get('/api/v1/projects/:id', projects.getOne);
  router.get('/api/v1/projects', projects.getAll);
  router.post('/api/v1/projects', projects.create);
  router.put('/api/v1/projects', projects.update);
  
  router.get('/api/v1/invoices/:id', invoices.getOne);
  router.get('/api/v1/invoices', invoices.getAll);
  router.post('/api/v1/invoices', invoices.create);
  router.put('/api/v1/invoices', invoices.update);

  return router;
};
