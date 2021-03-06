/** @format */

const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('../models/user');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
