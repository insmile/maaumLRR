'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Takehome Schema
 */
var TakehomeSchema = new Schema({
	name: { // 과제 이름, task 혹은 protocol의 이름이 자동 할당
		type: String,
		default: '',
		required: 'Please fill Takehome name',
		trim: true
	},
	created: { // 생성일시
		type: Date,
		default: Date.now
	},
	patient : { // 수행 환자
		type: Schema.ObjectId,
		ref: 'User'
	},
	assigner : { // takehome 지정 사용자
		type: Schema.ObjectId,
		ref : 'User'
	},
	task : { // 선택과제
		type: Schema.ObjectId,
		ref: 'Task'
	},
	setNum : Number,
	isProtocol : Boolean,
	protocol : { // 선택과제 겸 프로토콜 훈련
		type: Schema.ObjectId,
		ref: 'Protocol'
	},
	refResults : [
		{
			type: Schema.ObjectId,
			ref: 'Result'
		}
	],
	expired : { // 만료일, 만료일 설정이 없을 경우 무제한. 1주일일경우 created보다 1주일 뒤의 Date type으로 생성
		type: Date
	}
});

mongoose.model('Takehome', TakehomeSchema);
