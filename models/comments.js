/** @format */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
	date: { type: Date, default: new Date() },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
});

module.exports = mongoose.model('Comment', commentSchema);
