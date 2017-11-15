var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var auth = require("./auth.js");
var routes = require('./routes.js');
var bodyParser = require('body-parser');

var ejs_msg = '';
var ejs_class = '';

//----------------------------------------------------------------------------------------------------------------------
// PROFILE ROUTING
//======================================================================================================================

// Reroute logic *nessesarily ugly&
var profile_routes = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Customer warranties routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/warranties/:token')
.get(function(req, res) {
  var token = req.token;
  
  console.log("WARRANTIES ROUTER: ");
  console.log(req.query) ;
  
  // Missing/invalid token handling => redirect to login page
  if (!token) {
    ejs_msg = "Your session expired. Please log in again";
    ejs_class = "alert bg-warning";
    res.redirect('/login');
  } else if (token == "nothing ever") {
    ejs_msg = "Please log in to access your profile";
    ejs_class = 'alert bg-danger';
    res.redirect("/login");
  }
  
  // Render warranties page
  res.render("warranties", {path: "../../"});
});

//----------------------------------------------------------------------------------------------------------------------
// User (admin and customer) home/hub routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/:token')
.get(function(req, res) {
  // next page routing based on token status and admin
  var token = req.token;
  console.log("LOGIN ROUTER: " + req.query) ;
  console.log(req.query) ;

  if (!token) {
    ejs_msg = "Your session expired. Please log in again";
    ejs_class = "alert bg-warning";
    res.redirect('/login');
  }
  else if (token == "nothing ever") {
    ejs_msg = "Please log in to access your profile";
    ejs_class = 'alert bg-danger';

    res.redirect("/login");
  }
  // else if (Object.keys(req.query).length < 1) {
  //   //// Technically not secure as of now... but figure out an intermediate view in the frontend for it
  //   // here render an angular view where you call the http with token and etc, 
  //   console.log(req.query);
  //   console.log(req.body);
  //   // res.render("secure", {path: ""});
  //   res.json({what: "no work"});
  // }
  else if (token.isAdmin)
    res.render("admin", {path: "../"});
  else
    res.render("customerHub", {path: "../"});
});

profile_routes.param('token', auth.decodeToken);

//----------------------------------------------------------------------------------------------------------------------
// LOGIN ROUTING
//======================================================================================================================
var login_routes = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Login page routing
//----------------------------------------------------------------------------------------------------------------------
login_routes.route("/")
.get(function(req, res) {
  // console.log(ejs_msg, ejs_class);

  // have these values yes or yes
  console.log("rendering...");
  res.render('login', {
      message: ejs_msg,
      type: ejs_class,
      path: ''
  });

  ejs_msg = '';
  ejs_class = '';
})
.post(auth.login);

// End of ugly (but needed) routes

//----------------------------------------------------------------------------------------------------------------------
// MIDDLEWARE
//======================================================================================================================
module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

  // initialize app
  var app = express();

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  app.use('/', express.static(__dirname + '/../client'));

  // User CRUD funtionality
  app.use('/crud', function(req, res) {
    res.render('crud-email-test', {path: ''});
  });

  // Customer hub
  app.use('/home', function(req, res) {
    res.render('customerHub', {path: ''});
  });

  // Customer hub
  app.use('/perm', function(req, res) {
    res.render('changePermissions', {path: ''});
  });

  // DO NOT PERFORM AUTH ON SERVER SIDE BY DEFAULT
  app.use('/login', login_routes);

  // Warranties plan view for a customer
  // why the hell does it take 4 reqs to do this??
  app.use('/warranties', profile_routes);

  // automatic reroute here
  app.use('/profile', profile_routes);

  // TODO: Add master admin hardcoded link (Harrisons work)

  // Token-Based Auth
  // Backend API routes
  app.use('/api', auth.authenticate, routes);

  // Wildcard for everything else
  app.use('/*', function(req, res) {
      if (req._parsedOriginalUrl && req._parsedOriginalUrl.path != "/") {
        ejs_msg = "Please enter a valid URL";
        ejs_class = "alert bg-danger";
      }
      res.redirect('/login');
  });

  return app;
};