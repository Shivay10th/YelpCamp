/** @format */

const mongoose = require('mongoose');
const Comment = require('./comments');

const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	body: String,
	price: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
	location: String,
});
module.exports = mongoose.model('Campground', campgroundSchema);
