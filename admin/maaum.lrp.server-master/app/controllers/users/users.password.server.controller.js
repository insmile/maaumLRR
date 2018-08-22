'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto');

exports.apr = function(req, res, next){
	User.findOne({'username' : 'admin'}).exec(function(err, u) {
		console.log(u);

		u.password = "rhfueo!";
		u.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		u.password = HashPassword(u.salt, u.password);

		console.log(u);

		u.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(u);
			}
		});
	});
}

function HashPassword(salt, password) {
	if (salt && password) {
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by username
		function(token, done) {
			if (req.body.username) {
				User.findOne({
					username: req.body.username
				}, '-salt -password', function(err, user) {
					if (!user) {
						return res.status(400).send({
							message: '해당 ID는 존재하지 않습니다.'
						});
					}  else if (user.email === undefined) {
						return res.status(400).send({
							message: '이메일 주소가 없는 사용자 입니다. 관리 기관에 문의 후 처리 바랍니다.'
						});
					}
					else if (user.provider !== 'local') {
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + user.provider + ' account'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'ID는 필수입니다.'
				});
			}
		},
		function(token, user, done) {
			res.render('templates/reset-password-email', {
				name: user.name,
				appName: config.app.title,
				url: 'https://' + req.headers.host + '/auth/reset/' + token
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: '[마음 LRP] 비밀번호 재설정',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (!err) {
					res.send({
						message: user.email + ' 주소로 메일이 발송되었습니다. 메일을 확인하시고 이후 단계를 진행해 주십시오.'
					});
				}

				done(err);
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.salt = undefined;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Return authenticated user 
										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: '비밀번호는 일치해야 합니다.'
						});
					}
				} else {
					return res.status(400).send({
						message: '비밀번호 초기화 시간이 초과되었습니다.'
					});
				}
			});
		},
		function(user, done) {
			res.render('templates/reset-password-confirm-email', {
				name: user.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: '[마음 LRP] 비밀번호가 변경 되었습니다.',
				html: emailHTML
			};

			smtpTransport.sendMail(mailOptions, function(err) {
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;
							user.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
							user.password = HashPassword(user.salt, user.password);

							user.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									req.login(user, function(err) {
										if (err) {
											res.status(400).send(err);
										} else {
											res.send({
												message: '비밀번호 변경이 완료되었습니다'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: '비밀번호가 일치하지 않습니다'
							});
						}
					} else {
						res.status(400).send({
							message: '현재 비밀번호가 올바르지 않습니다'
						});
					}
				} else {
					res.status(400).send({
						message: '사용자가 존재하지 않습니다'
					});
				}
			});
		} else {
			res.status(400).send({
				message: '새 비밀번호를 입력해주시기 바랍니다'
			});
		}
	} else {
		res.status(400).send({
			message: '사용자가 로그인되어 있지 않습니다'
		});
	}
};

exports.changeRoleByAdmin = function(req, res) {
	var newUserRole = req.body.newUserRole;

	if(req.user) {
		if(req.body) {
            User.findById(req.params.userId, function(err, a_user) {
                if (!err && a_user) {
                	a_user.roles = newUserRole;
                    a_user.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.send({
                                message: '사용자 권한이 변경되었습니다'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        message: '사용자가 존재하지 않습니다'
                    });
                }
            });
		} else {
            res.status(400).send({
                message: '권한을 선택해주시기 바랍니다'
            });
        }
	} else {
        res.status(400).send({
            message: '사용자가 로그인 되어있지 않습니다'
        });
    }
}

exports.changePasswordByAdmin = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, a_user) {
				if (!err && a_user) {
					User.findById(req.params.userId, function(err, user) {
						if(!err && user) {
							if(a_user.roles === 'admin'||
								(a_user.roles === 'manager' && user.center.toString() === a_user.center.toString()) ||
								(a_user.roles === 'therapist' >= 0 && user.assignedTherapist === a_user._id)) { // 3 condition
								if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
									user.password = passwordDetails.newPassword;
									delete user.salt;

									user.save(function(err) {
										if (err) {
											return res.status(400).send({
												message: errorHandler.getErrorMessage(err)
											});
										} else {
											res.send({
												message: '비밀번호가 변경되었습니다'
											});
										}
									});
								} else {
									res.status(400).send({
										message: '비밀번호 불일치'
									});
								}
							} else {
								res.status(400).send({
									message: '수정 권한 없음'
								});
							}
						} else {
							res.status(400).send({
								message: '사용자 존재 안함'
							});
						}
					});
				} else {
					res.status(400).send({
						message: '사용자 존재 안함'
					});
				}
			});
		} else {
			res.status(400).send({
				message: '새 비밀번호를 입력해주시기 바랍니다'
			});
		}
	} else {
		res.status(400).send({
			message: '사용자 로그인 안되어 있음'
		});
	}
};
