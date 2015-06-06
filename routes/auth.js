var jwt = require('jwt-simple');

var auth = {
	
	displayLogin:  function (req, res) {
		res.render( 'login' );
	},
  
  loginApp: function (req, username, password, done) {
    var access_token = auth.getAccessToken(req);
    
    if (access_token.status && access_token.status == 401) {
      done(null, false, access_token.message);
    }
    
    done(null, {name:'Justin', id:1});
  },
  
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
 
    if (username == '' || password == '') {
      return {
        "status": 401,
        "message": "Invalid credentials"
      };
    }
 
    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password);
   
    if (!dbUserObj) { // If authentication fails, we send a 401 back
      return {
        "status": 401,
        "message": "Invalid credentials"
      };
    }
 
    if (dbUserObj) {
 
      // If authentication is success, we will generate a token
      // and dispatch it to the client
 
      return genToken(dbUserObj);
    }
 
  },
 
  validate: function(username, password) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
 
    return dbUserObj;
  },
 
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

// private method
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