'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	v = require('./validate');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	name : {
		type: String,
		trim: true,
		default: '',
		required : [true, '이름을 입력해 주십시오.']
	},
	username : {
		type: String,
		trim: true,
		default: '',
        index: { unique: true },
		required : [true, 'ID를 입력해 주십시오.']
	},
	department : {
		type: String,
		trim: true
	},
	sex : { // 성별
		type: String,
		enum: ['male', 'female', 'unknown'],
		default: 'unknown'
	},
	birthday : { // 생일
		type: Date
	},
	regNo : { // 등록 번호
		type: String
	},
	diagnosis : { // 진단명
		type : String
	},
	inciDate : { // 발병일
		type : Date
	},
	eduYear : { //교육년수
		type : Number
	},
	aphasiaType : { // 실어증 유형
		type : String
	},
	initialAQ : { // 초기 실어증 점수
		type : Number
	},
	handType : { // 손잡이
		type : String,
		enum: ['left', 'right', 'unknown'],
		default : 'unknown'
	},
	Job : { // 직업
		type : String
	},
	assignedTherapist : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	assignedTherapistName :
	{
		type : String
	},
	certified : {
		type : Boolean,
		default : false
	},
	has_key : {
		type : Boolean,
		default : false
	},
	email: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, '이메일 주소를 입력해 주십시오.'],
		match: [/.+\@.+\..+/, '올바른 이메일 주소를 입력해 주십시오.']
	},
	password: {
		type: String,
		default: '',
		required : [true, '비밀번호를 입력해 주십시오.'],
		validate: [validateLocalStrategyPassword, '비밀번호는 6글자 이상이어야 합니다.']
	},
	salt: {
		type: String
	},
	tel : {
		type: String,
		validate: [v.phone, '000-0000-0000 양식에 맞추어 전화번호를 입력해 주십시오.']
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
        type: String,
        enum: ['patient', 'admin', 'therapist', 'doctor', 'manager'],
		default: 'patient'
	},
	starredProgressTemplates : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProgressTemplate'
		}
	],
    progressNotes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Progressnote'
        }
    ],
    officialTests : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Officialtestdatum'
        }
    ],
	center: {
    	type:mongoose.Schema.Types.ObjectId,
		ref:'Center'
	},
	center_name: {
		type:String,
		default: "MAAUM"
	},
	center_id : {
        type : String
    },
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	expired_date : {
		type : Date,
		default : Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	this.updated = Date.now();
	if (this.salt === undefined && this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
