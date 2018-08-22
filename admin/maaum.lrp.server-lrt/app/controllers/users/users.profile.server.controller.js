'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
    util = require('../util.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	ProgressNote = mongoose.model('Progressnote'),
	Officialtestdatum = mongoose.model('Officialtestdatum'),
	async = require('async'),
	crypto = require('crypto');

function HashPassword(salt, password) {
	if (salt && password) {
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

function UserSave(user, res) {
	console.log(user);
	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(user);
		}
	});
}
/**
 * Update user details
 */
exports.update = function(req, res) {

	// Init Variables
	var user = req.user;

	if(req.profile !== undefined)
	{
		user = req.profile;
	}

	User.findById(user._id).exec(function(err, u) {
		if(err) {
			return res.status(400).send({
				message: "user is not signin"
			});
		} else {
			user = u;

			var newUser;
			if(req.body.json !== undefined)
			{
				try{
					console.log("update - req.body.json");
					//console.log(req.body.json);

					newUser = JSON.parse(req.body.json);
				} catch(err)
				{
					console.log("JSON parsing error");
					return res.status(400).send({
						message: "JSON parsing error"
					});
				}
			}
			else {
				console.log("update - req.body");
				//console.log(req.body);
				newUser = req.body;
			}
			var message = null;

			// For security measurement we remove the roles from the req.body object
			delete newUser.roles;

			console.log(newUser);

			if(newUser.password !== undefined) { // 패스워드가 있다는 것은 새로운 패스워드가 입력된 것임
				if (newUser.password && newUser.password.length > 5) {
					newUser.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
					newUser.password = HashPassword(newUser.salt, newUser.password);
				} else {
					return res.status(400).send({
						message: "Length of password must exceed 6 letter."
					});
				}
			}

			console.log(newUser.assignedTherapist);

			if(newUser.assignedTherapist === undefined) {
				console.log("new user has no assigned therapist");
				user.assignedTherapist = undefined;
				user.assignedTherapistName = undefined;
			}

			console.log(user);

			if (user) {
				// Merge existing user
				user = _.extend(user, newUser);
				user.updated = Date.now();
				user.displayName = user.firstName + ' ' + user.lastName;

				console.log(user.assignedTherapist);

				if(user.assignedTherapist !== undefined)
				{
					User.findById(user.assignedTherapist, function(err, therapist){
						if(err){
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							user.assignedTherapistName =  therapist.name;
							UserSave(user, res);
						}
					});
				}
				else
				{
					UserSave(user, res);
				}
			} else {
				console.log(res);
				res.status(400).send({
					message: 'User is not signed in'
				});
			}
		}
	});
};

/**
 * Update user details
 */
exports.delete= function(req, res) {
	var user = req.profile ;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			/*async.eachSeries(user.officialTests, function iterator(test, callback){
				test.remove(function (err) {
					if (err) {
						return res.status(400).send({
							message: err
						});
					} else {
						callback();
					}
				});
			}, function done(err) {
				if(err) {
					return res.status(400).send({
						message: err
					});
				} else {
					async.eachSeries(user.progressNotes, function iterator(note, callback) {
						note.remove(function (err) {
							if (err) {
								return res.status(400).send({
									message: err
								});
							} else {
								callback();
							}
						});
					}, function done(err) {
						if(err) {
							return res.status(400).send({
								message: err
							});
						} else {
							res.jsonp(user);
						}
					});
				}
			});*/
			res.jsonp(user);
		}
	});
}

var findUser = function(userId) {
	return new Promise(function(resolve, reject) {
		User.findById(userId).exec(function(err, user) {
			if(err)
				reject(err);
			resolve(user);
		})
	});
}

var saveUser = function(user) {
	return new Promise(function(resolve, reject) {
		user.save(function(err) {
			if(err)
				reject(err);
			else
				resolve("ok");
		})
	});
};

exports.activation = function(req,res) {
	var _query = req.body;
	var user = req.user;
	var center = null;
	var has_key = true;
    var u;

    console.log("exports.activation : ");
    console.log(_query);

	findUser(_query.userId)
		.then(function(foundUser) {
            u = foundUser;
			if(u.center !== undefined) {
				console.log(u);
				return util.getkeynum(u.center);
			}
		})
		.then(function(keyObj) {
			console.log(keyObj);
            if(keyObj !== undefined && u.has_key === false && _query.has_key && keyObj.left_key_num <= 0) {
                return new Promise(function(resolve, reject) {
                	reject("활성화 가능 키 개수 부족");
                });
			} else {
                u.has_key = _query.has_key;
                if(_query.expired_duration !== undefined)
                    u.expired_date = util.addDays(parseInt(_query.expired_duration));
                if(_query.expired_date !== undefined)
                    u.expired_date = _query.expired_date;
                if(_query.has_key == false)
                    u.expired_date = undefined;
                return saveUser(u);
			}
		})
		.then(function(result) {
            res.send(result);
		})
		.catch(function(err) {
			console.error(err);
            res.status(400).send({
                message: err
            });
		});
};

/**
 * Update user details
 */
exports.assign = function(req, res) {


	var _query = req.body;
	var isAdmin = false;
	var therapist = null;
	var user = req.user;

	if(_.contains(["admin", "doctor", "manager"], user.roles) === true)
	{
		isAdmin = true;
	}

	var CheckTherapist =  function(next) {
        if(user.roles === "therapist" && _query.therpiastId === undefined)
        {
            therapist = user;
			next(null, therapist);
        }
        else {
            User.findById(_query.therapistId).exec(function(err, user) {
				if (user)
                {
                    therapist = user;
					next(null, therapist);
                } else {
					res.status(400).send({
					});
                }
            });
        }
    };

	CheckTherapist(function(err, therapist) {
		if(err == null) {
			User.findById(_query.patientId).exec(function (err, user) {
				if (user) {

					// Merge existing user
					user.assignedTherapist = therapist._id;
					user.assignedTherapistName = therapist.name;
					user.updated = Date.now();

					user.save(function (err) {
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
						message: '해당 patient는 존재하지 않습니다.'
					});
				}
			});
		}
	});
};


exports.unassign = function(req, res) {

	var _query = req.body;
	var isAdmin = false;
	var therapist;
	var user = req.user;

    if(_.contains(["admin", "doctor", "manager"], user.roles) === true)
	{
		isAdmin = true;
	}

	function therpiastUnassign() {
		User.findById(_query.patientId).exec(function (err, user) {
			if (user) {
				console.log(user);

				User.update({_id: user._id}, {updated : Date.now(), $unset: {assignedTherapist: 1, assignedTherapistName:1 }}, function (err) {
					if (err) {
						res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.send("ok");
					}});
			} else {
				res.status(400).send({
					message: "해당 therapist는 존재하지 않습니다."
				});
			}
		});
	}

	therpiastUnassign();
};
/**
 * Send User
 */
exports.me = function(req, res) {
	delete req.user.password;
	res.json(req.user || null);
};
