/** @format */

const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			if (err) {
				req.flash('error',err.message);
				res.redirect('/register');
			}
			passport.authenticate('local')(req, res, function () {
				req.flash('success','Welcome '+user.username);
				res.redirect('/campground');
			});
		}
	);
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campground',
		failureRedirect: '/register',
		failureFlash:true,
		successFlash:true
	})
);

router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success','logged u out');
	res.redirect('/campground');
});

router.get('/', (req, res) => {
	res.render('home');
});

router.get('*', (req, res) => {
	res.redirect('/');
});

module.exports = router;
