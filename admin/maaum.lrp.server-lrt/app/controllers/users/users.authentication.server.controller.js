'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    Center = mongoose.model('Center');

function UserSave(user, res) {

    User.count({ "username": user.username }).exec(function(err, dup_user_num) {
        if (dup_user_num == 0) {
            console.log("UserSave");
            // Then save the user
            user.save(function(err) {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        return res.status(400).send({
                            message: "중복된 사용자 ID가 존재합니다. 다른 ID를 선택하여 주십시오."
                        });
                    }
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    // Remove sensitive data before login
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);
                }
            });
        } else {
            return res.status(400).send({
                message: "중복된 사용자 ID가 존재합니다. 다른 ID를 선택하여 주십시오."
            });
        }
    });
}

function signup_next_op(user, res) {
    // Add missing user fields
    user.provider = 'local';

    if (user.assignedTherapist !== undefined) {
        console.log("assignedTherapist");
        User.findById(user.assignedTherapist, function(err, therapist) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                user.assignedTherapistName = therapist.name;
                UserSave(user, res);
            }
        });
    } else {
        UserSave(user, res);
    }
}
/**
 * Signup
 */
exports.signup = function(req, res) {
    // For security measurement we remove the roles from the req.body object
    //delete req.body.roles;

    // Init Variables
    if (req.body.json !== undefined) {
        try {
            var user = new User(JSON.parse(req.body.json));
        } catch (err) {
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    } else {
        var user = new User(req.body);
    }

    if (req.user !== undefined && req.user.center !== undefined && user.center === undefined) {
        user.center = req.user.center;
    }

    if (user !== undefined && user.center !== undefined) {
        Center.findById(user.center, function(err, center) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                user.center_name = center.name;
                user.center_id = center.center_id;
                signup_next_op(user, res);
            }
        })
    } else {
        signup_next_op(user, res);
    }
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            if (info.code !== undefined) {
                res.status(info.code).send(info);
            } else {
                res.status(400).send(info);
            }
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                roleExtractor(user)
                    .then(function(modifiedUser) {
                        user = modifiedUser;
                        res.json(user);
                    })
                    .catch(function(err) {
                        res.status(401).send(err);
                    });
            });
        }
    })(req, res, next);
};

var roleExtractor = function(user) {
    return new Promise(function(resolve, reject) {
        if (Array.isArray(user.roles)) {
            user.roles = user.roles[0];
        }
        resolve(user);
    });
};

var expiredTest = function(user) {
    // 일반적인 로그인 실패는 401
    // 인증 실패는 402
    return new Promise(function(resolve, reject) {
        console.log("expiredTest 진입");
        if (user === undefined) reject("환자가 설정되지 않았습니다!");
        if (user.roles === 'patient' && user.center !== undefined) {
            if (user.certified === false)
                reject("해당 사용자는 활성화되지 않았습니다. 기관에 문의 바랍니다.");
            if (user.expired_date === undefined)
                reject("사용자 데이터 불일치! 기관에 문의 바랍니다.");
            if (user.expired_date < Date.now())
                reject("해당 사용자의 사용 기간이 만료되었습니다. 기관에 문의 바랍니다.");
        }
        resolve("ok");
    });
};

exports.expiredTest = function(req, res, next) {
    expiredTest(user)
        .then(function(msg) {
            next();
        })
        .catch(function(msg) {
            console.log("expiredTest false");
            res.status(402).send(msg);
        });
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.removeAdmin = function(req, res) {
    User.find({ 'username': 'admin' }, function(err, admin) {
        admin.remove(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(admin);
            }
        });
    });

    res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#!/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/#!/signin');
                }

                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) user.additionalProvidersData = {};
            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function(err) {
                return done(err, user, '/#!/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
    var user = req.user;
    var provider = req.param('provider');

    if (user && provider) {
        // Delete the additional provider
        if (user.additionalProvidersData[provider]) {
            delete user.additionalProvidersData[provider];

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');
        }

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
                        res.json(user);
                    }
                });
            }
        });
    }
};