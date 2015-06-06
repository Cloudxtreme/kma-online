var express 	   = require('express');
var path 		     = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var morgan 		   = require('morgan');
var session      = require('express-session');
var MongoStore   = require("connect-mongo")(session);
var passport     = require('passport');
var config       = require('./config')();
var auth         = require('./routes/auth.js');

var express = require('express');
var app = express();

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

/* Mongo Session Setup */
app.use(session({ 
  store: new MongoStore({
    url: config.mongo_url,
    ttl: 60 * 30
  }),
  secret: 'mongo secret'
}));

/* Setup Static Handling */
app.use(express.static(path.join(__dirname, 'public')));

/* Passport Setup */
var LocalStrategy = require('passport-local').Strategy;

passport.use('local_kma', new LocalStrategy( {passReqToCallback: true },
	auth.loginApp));
  
passport.serializeUser(function (user, done) {
	var id = user.id;
	done(null, id);
});

passport.deserializeUser(function (req, id, done) {
//	req.models.User.find(id).then(function (user) {
//    if (user)
//		  done(null, user);
//		else
//			done(null, null);
//	});
  done(null, {name: 'Justin', id: 1});
});

app.use(passport.initialize());
app.use(passport.session()   );

app.post('/login', function (req, res, next) {
  passport.authenticate('local_kma', function(err, user, info) {
    if (err) { return next(err); }
    console.log('info: ', info);
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/app/');
    });
  })(req, res, next);
})

module.exports = app;