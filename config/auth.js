/** @format */
const mid = {};
const Campground = require('../models/campground');
const Comment = require('../models/comments');

mid.isauth = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error', 'Please Login!!');
		res.redirect('/login');
	}
};

mid.isOwner = function (req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, camp) => {
			if (err || !camp) {
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				if (camp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'you are not allowed to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'you need to login for that.');
		res.redirect('back');
	}
};

mid.isOwnerOfComment = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.idc, (err, comment) => {
			if (err || !comment) {
				req.flash('error', 'Comment does not exist');
				res.redirect('back');
			} else {
				if (comment.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash('Sorry But You Can Not Do That');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('Please Login First');
		res.redirect('back');
	}
};

module.exports = mid;
