'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProgressTemplate = mongoose.model('ProgressTemplate'),
    User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Progress
 */
exports.create = function(req, res) {
	var progressTemplate = new ProgressTemplate(req.body);
    progressTemplate.user = req.user;

    if(req.user.center !== undefined)
        progressTemplate.center = req.user.center;

    progressTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(progressTemplate);
		}
	});
};

/**
 * Show the current Progress
 */
exports.read = function(req, res) {
	res.jsonp(req.progressTemplate);
};

/**
 * Update a Progress
 */
exports.update = function(req, res) {
	var progressTemplate = req.progressTemplate;

    console.log(req.body);

    var updatedData = req.body;

    updatedData.updated = Date.now();

    console.log(updatedData);

    progressTemplate = _.extend(progressTemplate , updatedData);

    progressTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(progressTemplate);
		}
	});
};

/**
 * Delete an Progress
 */
exports.delete = function(req, res) {
	var progressTemplate = req.progressTemplate ;

    progressTemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(progressTemplate);
		}
	});
};

/**
 * List of Progresses
 */
exports.list = function(req, res) {

    var query = {};
    if(req.user.roles !== 'admin' && req.user.center !== undefined) {
        query = {$or : [
            { 'center' : new mongoose.Types.ObjectId(req.user.center) }
        ]};
    }

	var select = {
		__v:0,
		content:0
	};

	ProgressTemplate.find(query, select).sort('-created').populate('user', 'name').exec(function(err, progressTemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(progressTemplates);
		}
	});
};

exports.listByUserID = function(req, res) {

    var where = {};

    if(req.profile === undefined) {
        return res.status(400).send({
            message: "해당 user는 존재하지 않습니다."
        });
    }

    var select = {
        __v:0,
        content:0
    };

    ProgressTemplate.find(where, select).sort('-created').populate('user', 'name').exec(function(err, progressTemplates) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var starred = req.profile.starredProgressTemplates;
            progressTemplates.forEach(function(x, index) {
                if(starred.indexOf(x._id) > -1)
                {
                    x.starred = true;
                } else {
                    x.starred = false;
                }
            });
            res.jsonp(progressTemplates);
        }
    });
};



/**
 * Progress middleware
 */
exports.progressByID = function(req, res, next, id) {
	ProgressTemplate.findById(id).populate('user', 'displayName').exec(function(err, progressTemplate) {
		if (err) return next(err);
		if (! progressTemplate) return next(new Error('Failed to load progressTemplate ' + id));
        if(req.user.roles !== 'admin' && req.user.center !== undefined) {
            if(req.user.center.equals(progressTemplate.center) == false)
            {
                return res.status(400).send("has no permission");
            }
        }
		req.progressTemplate = progressTemplate ;
		next();
	});
};

exports.starred = function(req, res) {

    if(req.body.progressTemplateID === undefined) {
        return res.status(400).send({
            message: "progress Template ID가 필요합니다."
        });
    }
    if (req.body.userID === undefined) {
        return res.status(400).send({
            message: "user ID가 필요합니다."
        });
    }
    var progressTemplateID = req.body.progressTemplateID;
    var userID = req.body.userID;

    ProgressTemplate.findById(progressTemplateID).exec(function(err, progressTemplate){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (!progressTemplate) {
            return res.status(400).send("no progress template");
        } else {
            User.findById(userID).exec(function (err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (!user) {
                    return res.status(400).send("no user");
                } else {
                    console.log(user);
                    if(user.starredProgressTemplates.indexOf(progressTemplate._id) < 0){
                        user.starredProgressTemplates.push(progressTemplate._id);
                        console.log(user);
                        //res.jsonp("ok");
                        user.save(function (err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                res.jsonp("ok");
                            }
                        });
                    } else {
                        res.jsonp("ok");
                    }
                }
            });
        }
    });
};

exports.unstarred = function(req, res) {
    if(req.body.progressTemplateID === undefined) {
        return res.status(400).send({
            message: "progress Template ID가 필요합니다."
        });
    }
    if (req.body.userID === undefined) {
        return res.status(400).send({
            message: "user ID가 필요합니다."
        });
    }
    var progressTemplateID = req.body.progressTemplateID;
    var userID = req.body.userID;

    ProgressTemplate.findById(progressTemplateID).exec(function(err, progressTemplate){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            User.findById(userID).exec(function (err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    if(user.starredProgressTemplates.indexOf(progressTemplate._id) >= 0){

                        var idx = user.starredProgressTemplates.indexOf(progressTemplate._id);
                        user.starredProgressTemplates.splice(idx, 1);
                        user.save(function (err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                res.jsonp("ok");
                            }
                        });
                    } else {
                        res.jsonp("ok");
                    }
                }
            });
        }
    });
};

/**
 * Progress authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if ( req.user.roles === "patient" &&
		req.progressTemplate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
