/** @format */

const express = require('express'),
	engine = require('ejs-mate'),
	app = express(),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	localStrategy = require('passport-local'),
	flash = require('connect-flash'),
	methodOverride = require('method-override'),
	seedDB = require('./seeds');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(methodOverride('_method'));

app.use(
	express.urlencoded({
		extended: true,
	}),
);

//pasport configuration
require('./config/passport');

app.use(
	session({
		secret: 'conceal it',
		resave: true,
		saveUninitialized: false,
	}),
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// seedDB();
mongoose.connect('mongodb://localhost/yelp_camp', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

app.use(function (req, res, next) {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/campground', require('./routes/campground'));

//===========
//comment routes
//===========

app.use('/campground/:id/comments', require('./routes/commentroutes'));

//===========
//auth routes
//===========

app.use('/', require('./routes/authen'));

app.listen(3000);
