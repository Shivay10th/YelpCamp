/** @format */

const router = require('express').Router({ mergeParams: true });

const Campground = require('../models/campground');

const Comment = require('../models/comments');

const mid = require('../config/auth');

router.get('/new', mid.isauth, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		//it is not because of campground name it is because of giving back info of camground to the POST route.
		if (err) {
			console.log('error:', err);
		} else {
			res.render('comments/new', {
				campground: campground,
			});
		}
	});
});

//Comment create

router.post('/', mid.isauth, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		Comment.create(req.body.comment, (err, comment) => {
			if (err) {
				console.log('Error', err);
			} else {
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				req.flash('success','added a comment');
				res.redirect('/campground/' + req.params.id);
			}
		});
	});
});

//edit

router.get('/:idc/edit', mid.isOwnerOfComment, (req, res) => {
	Comment.findById(req.params.idc, (err, cam) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campId: req.params.id, comment: cam });
		}
	});
});

//update

router.put('/:idc', mid.isOwnerOfComment, (req, res) => {
	Comment.findByIdAndUpdate(req.params.idc, req.body.comment, (err, cam) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campground/' + req.params.id);
		}
	});
});

//delete

router.delete('/:idc', mid.isOwnerOfComment, (req, res) => {
	console.log(req.params.idc);
	Comment.findByIdAndRemove(req.params.idc, (err) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success','Comment deleted');
			res.redirect(`/campground/${req.params.id}`);
		}
	});
});

module.exports = router;
