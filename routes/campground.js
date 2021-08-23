/** @format */

const router = require('express').Router(),
	Campground = require('../models/campground');
const mid = require('../config/auth');
const campground = require('../models/campground');

router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			// console.log(req.user);
			res.render('campground/campground', {
				campground: campgrounds,
			});
		}
	});
});

router.post('/', mid.isauth, (req, res) => {
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let description = req.body.description;
	Campground.create(
		{
			name: name,
			image: image,
			body: description,
			price: price,
			author: { id: req.user._id, username: req.user.username },
		},
		(err, newcampground) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/campground');
			}
		}
	);
});

router.get('/new', mid.isauth, (req, res) => {
	res.render('campground/new');
});

//show

router.get('/:id', (req, res) => {
	//populating comments (id to array) https://mongoosejs.com/docs/populate.html
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, camp) => {
			if (err) {
				req.flash('error', 'this Campground does not exist');
				res.redirect('back');
			} else {
				if (!camp) {
					req.flash('error', 'this Campground does not exist');
					res.redirect('back');
				} else {
					res.render('campground/show', {
						campground: camp,
					});
				}
			}
		});
});

//edit

router.get('/:id/edit', mid.isOwner, (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		res.render('campground/edit', { campground: camp });
	});
});

//update

router.put('/:id', mid.isOwner, (req, res) => {
	Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground,
		(err, camp) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/campground/' + req.params.id);
			}
		}
	);
});
//delete
router.delete('/:id', mid.isOwner, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, removed) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campground');
		}
	});
});

module.exports = router;
