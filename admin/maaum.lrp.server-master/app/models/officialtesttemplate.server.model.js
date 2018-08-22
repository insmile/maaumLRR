'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Officialtesttemplate Schema
 */
var OfficialtesttemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Officialtesttemplate name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    center: {
        type:Schema.ObjectId,
        ref : 'Center'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Officialtesttemplate', OfficialtesttemplateSchema);
