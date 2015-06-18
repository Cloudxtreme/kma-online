var express 	    = require('express');
var path 		      = require('path');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var morgan 		    = require('morgan');
var session       = require('express-session');
var MongoStore    = require("connect-mongo")(session);
var flash         = require('connect-flash'); 
var passport      = require('passport');
var config        = require('./config')();
var auth;          
var querystring   = require('querystring');
var autoIncrement = require('mongoose-auto-increment');

var express = require('express'),
    app = express();

var mongoose = require('mongoose'),
    Models;
    
/* Logger Setup */
if (process.env.NODE_ENV != 'production')
  app.use(morgan('dev'));

/* Jade View Engine Setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* Cookie and Body Parser Setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//temp redirect to login for app
app.get('/', function (req, res) {
  res.redirect('/app/login');
});

/* Setup Static Handling */
app.use(express.static(path.join(__dirname, 'public')));
   
/* MongoDB Connection and Session Setup */
console.log('setting up mongoose');
mongoose.connect(config.mongo_url, function(err) {
  if (err) {
    console.error('Error connecting to MongoDB. Make sure mongodb is running.');
    throw err;
  }
  
  console.log('Successfully connected to MongoDB' );
  
  //Must be called after mongoose has connected.
  autoIncrement.initialize(mongoose.connection);
  Models = require('./models');
  auth = require('./routes/auth.js');
  
  app.use(session({ 
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        ttl: 60 * 30
      }),
    secret: 'mongo secret',
    saveUninitialized: true,
    resave: true
  }));
  
  addTestUser();
  
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session()   );
  
  /* Passport Setup */
  var LocalStrategy = require('passport-local').Strategy;
  
  passport.use('local_kma', new LocalStrategy( { passReqToCallback: true },
  	auth.loginApp));
    
  passport.serializeUser(function (user, done) {
  	var id = user._id;
  	done(null, id);
  });
  
  passport.deserializeUser(function (req, id, done) {
  	Models.User.findOne({ _id: id }).exec()
      .then(function (dbUser) {
        if (dbUser)
  		    done(null, dbUser);
  		  else
  			  done(null, null);
      });
  });
  
  app.post('/app/login', function (req, res, next) {
    passport.authenticate('local_kma', { failureFlash : true }, function(err, user, info) {
      if (err)
        return next(err);
        
      //Add the failure message in here.  
      if (!user) {
        if (info)
          req.flash('login', info.message);
        return res.redirect('/app/login');
      } 
      
      req.logIn(user, function(err) {
        if (err)
          return next(err);
          
        return res.redirect('/app/');
      });
      
    })(req, res, next);
  });
  
          
  /* Router setup */
  app.use('/', require('./routes')());
  
});

function addTestUser() {
  //if (process.env.NODE_ENV == "production")
  //  return;
    
  Models.User.find(function (err, users){
    if (err || (users && users.length > 0))
      return;
      
    // create a user a new user
    var defaultUser = new Models.User({
      username: "admin",
      password: "password"
    });
   
    // save user to database
    defaultUser.save(function(err) {
      if (err) throw err;
    });
  });
    
}

module.exports = app;