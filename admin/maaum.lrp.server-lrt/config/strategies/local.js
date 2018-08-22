'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User'),
	util = require('../../app/controllers/util.server.controller.js');

module.exports = function() {
	// Use local strategy

	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {

            var user;
            var expiredTest = function(user) {
                return new Promise(function(resolve, reject) {
                    if(user === undefined) reject("no patient assigned!");
                    if(user.roles === 'patient' && user.center !== undefined) {
                        if(user.certified === false || user.has_key === false)
                            reject("인증되지 않은 사용자 입니다. 기관에 문의 바랍니다.");
                        if(user.expired_date === undefined)
                            reject("currupted user!");
                        if(user.expired_date < Date.now())
                        	reject("사용 기간이 만료된 사용자 입니다.");
                    }
                    resolve("ok");
                });
            };
            var getKeyArgs = function(msg) {
                return new Promise(function(resolve, reject) {
                    if(user.center !== undefined)
                        util.getkeynum(user.center)
                            .then(function(keyArgs) {
                                resolve(keyArgs);
                            }).catch(function(err) {
                            reject(err);
                        })
                    else
                        resolve("");
                });
            };
            var checkKeyArgs = function(keyArgs) {
            	return new Promise(function(resolve, reject) {
                    console.log(keyArgs);
                    if(keyArgs.left_key_num < 0) {
                    	trimUser(keyArgs.left_key_num * -1)
							.then(function(msg) {
								resolve(msg);
							})
							.catch(function(err) {
								reject(err);
							})
                    }
                    else {
                        resolve("ok");
                    }
				});
            };
            var trimUser = function(trim_num) {
            	return new Promise(function(resolve, reject) {
                    if (user.center === undefined)
                        resolve("ok");
                    else {
                        User.find({
                            center: user.center,
                            roles: 'patient',
                            has_key: true
                        }).sort({expired_date: -1}).exec(function (err, users) {
                            var trim_users = users.slice(0, trim_num);
                            Promise.all(trim_users.map(u => _releaseKey(u.username)))
                                .then(function () {
                                    if (trim_users.indexOf(user) == -1)
                                        reject("활성화 가능 키 개수 부족으로 로그인 불가. 기관에 문의 바랍니다.")
                                    else
                                        resolve("ok");
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        });
                    };
                });
			};
            var login = function() {
                return done(null, user);
			};
            var _releaseKey = function(u_name, msg) {
                return new Promise(function(resolve, reject) {
                    User.findOne({username:u_name}).exec(function(err, u) {
                        if(err) reject(err);
                        u.has_key = false;
                        u.save(function(err) {
                            if(err) reject(err);
                            if(msg !== undefined) reject(msg);
                            else resolve("ok");
                        });
                    });
                });
			}
            var releaseKey = function(msg) {
				return _releaseKey(user.username, msg);
            };

			User.findOne({
				username: username
			}).populate('assignedTherapist')
			.exec(function(err, u) {
				user = u;
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
					    code: 401,
						message: 'ID가 없습니다.'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
					    code: 401,
						message: '비밀번호가 일치하지 않습니다.'
					});
				}
                expiredTest(user)
					.catch(releaseKey)
					.then(getKeyArgs)
					.then(checkKeyArgs)
					.then(login)
					.catch(function(error) {
                        return done(null, false, {
                            code:402,
                            message: error
                        });
					});
			});
		}
	));
};
