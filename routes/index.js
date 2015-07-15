var multer   = require('multer');
var express  = require('express');
var router   = express.Router();

var auth     = require('./auth.js');
var api      = require('./api');
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
  
  /* Validate users' sessions for the app */
  router.all('/app/*', [require('../middleware/validateAppUser')]);
  
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
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/overview', app.invoices.overview);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/items', app.invoices.items);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/additems', app.invoices.addItems);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/labor', app.invoices.labor);
  router.get('/app/clients/:clientId/projects/:projectId/invoices/:id/workers', app.invoices.workers);
  
  router.use('/app/utils/ws-selector', multer({
    dest: "./uploads/"
  }));
  router.post('/app/utils/ws-selector', app.utils.wsSelector);
  
  /* API routes */
  router.get('/api/v1/user/:id', api.users.getOne);
  
  router.get('/api/v1/clients/:id', api.clients.getOne);
  router.get('/api/v1/clients', api.clients.getAll);
  router.post('/api/v1/clients', api.clients.create);
  router.put('/api/v1/clients', api.clients.update);
  
  router.get('/api/v1/projects/:id', api.projects.getOne);
  router.get('/api/v1/projects', api.projects.getAll);
  router.post('/api/v1/projects', api.projects.create);
  router.put('/api/v1/projects', api.projects.update);
  
  router.get('/api/v1/invoices/:id', api.invoices.getOne);
  router.get('/api/v1/invoices', api.invoices.getAll);
  router.post('/api/v1/invoices', api.invoices.create);
  router.put('/api/v1/invoices', api.invoices.update);
  
  router.post('/api/v1/itementries/items', api.itemEntries.createItem);
  router.post('/api/v1/itementries/additems', api.itemEntries.createItem);
  router.put('/api/v1/itementries', api.itemEntries.update);
  router.delete('/api/v1/itementries/:id', api.itemEntries.delete);
  
  router.post('/api/v1/laborentries', api.laborEntries.create);
  router.put('/api/v1/laborentries', api.laborEntries.update);
  router.delete('/api/v1/laborentries/:id', api.laborEntries.delete);

  return router;
};
