'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Progressnote Schema
 */
var ProgressNoteSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: '프로그레스 노트 명을 입력해 주십시오.',
        trim: true
    },
    content: {
        type: String,
        required: '프로그레스 노트 내용을 입력해 주십시오.'
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
    }
});
mongoose.model('Progressnote', ProgressNoteSchema);
