'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Progress Schema
 */
var ProgressTemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: '프로그레스 노트 템플릿 명을 입력해 주십시오.',
		trim: true
	},
	content: {
		type: String,
		required: '프로그레스 노트 템플릿 내용을 입력해 주십시오.'
	},
    center: {
        type:Schema.ObjectId,
        ref : 'Center'
    },
	created: {
		type: Date,
		default: Date.now
	},
    updated: {
        type: Date,
        default: Date.now
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    starred : {
        type : Boolean
    }
});

mongoose.model('ProgressTemplate', ProgressTemplateSchema);
