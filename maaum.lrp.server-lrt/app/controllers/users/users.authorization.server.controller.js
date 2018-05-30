'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

exports.certify = function(req, res) {
	var _query = req.body;

	User.findById(_query.id).exec(function(err, user) {
		if (user) {
			// Merge existing user
			user.certified = !user.certified;
			user.updated = Date.now();

			user.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.send("ok");
				}
			});
		} else {
			res.status(400).send({
				message: '해당 user는 존재하지 않습니다.'
			});
		}
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {

		_this.requiresLogin(req, res, function() {
			if (_.contains(roles, req.user.roles) === true) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};
