//grab dependencies
var express  = require('express'),
	app      = express(),
	port     = process.env.PORT || 8080,
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash    = require('connect-flash'),

	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),
	session      = require('express-session'),

	configDB = require('./config/database.js')

//app configuration
mongoose.connect(configDB.url) //connect to database

require('./config/passport')(passport) //pass passport for configuration

//set up express
app.use(cookieParser()) //read cookies (needed for auth)
app.use(bodyParser()) //get information from html forms

app.set('view engine', 'ejs') //set ejs as view engine

// required for passport
app.use(session({ secret: 'buahahahaha' })) //session secret
app.use(passport.initialize())
app.use(passport.session()) //persistent login sessions
app.use(flash()) //use connect-flash for flash messages stored in session

//routes
require('./app/routes.js')(app, passport) //load routes and pass in our app and fully configured passport

//launch
app.listen(port)
console.log('Ya udah jalan di ' + port)