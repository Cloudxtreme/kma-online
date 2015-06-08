var Promise = require('bluebird');
var jwt = require('jwt-simple');
var Models = require('../models');

var auth = {
	
  /* Renders the login page with possible flash message */
	displayLogin:  function (req, res) {
    var msg;
    msg = req.query.msg || null;
    
		res.render('login', { msg: req.flash && req.flash('login') });
	},
  
  /* Login function for the web app */
  loginApp: function (req, username, password, done) {
    auth.getAccessToken(req)
      .then(function (access_token) {
        if (access_token.status && access_token.status == 401) {
          return done(null, false, access_token);
        } else {
          return done(null, access_token.user);  
        }
      })
      .catch(function (err) {
        console.log('Error in loginApp:', err);
      });
  },
  
  /* Login function for the API */
  loginApi: function (req, res) {
    var access_token = auth.getAccessToken(req);
    
    if (access_token.status && access_token.status == 401) {
      res.status(401);
      res.json(access_token);
    }
    
    res.json(access_token);
  },
	
	getAccessToken: function(req) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
  	
    // Fire a query to your DB and check if the credentials are valid
    return auth.validate(username, password)
      .then(function (user) {
        if (!user) { 
          // If authentication fails, we send a 401 back
          return {
            status: 401,
            message: "Invalid credentials"
          };
        } else {
          // If authentication is success, we will generate a token
          // and dispatch it to the client
          return genToken(user);
        }
      });
 
  },
 
  /* Validates the username and password against the user db. */
  validate: function(username, password) {
    var user;
    
    return Promise.resolve(Models.User.findOne({ username: username }).exec())
      .then(function (dbUser) {
        if (!dbUser)
          return null;
          
        user = dbUser;    
        return user.comparePassword(password);
      })
      .then(function (isMatch) {
        if (!user) 
          return null;
          
        return (isMatch) ? user : null;
      });
  },
 
  /* Still don't know what this is for. */
  validateUser: function(username) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
 
    return dbUserObj;
  },
	
};

/* Generates a JWT Token */
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;