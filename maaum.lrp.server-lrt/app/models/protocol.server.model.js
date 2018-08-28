'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Protocol Schema
 */
var ProtocolSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Protocol name',
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
	isProtocol : Boolean,
	tasks : [
		{
			setSize : Number,
			setNum : Number,
			taskID : {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Task'
			}
		}
	],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated : {
		type: Date
	}
});

mongoose.model('Protocol', ProtocolSchema);
