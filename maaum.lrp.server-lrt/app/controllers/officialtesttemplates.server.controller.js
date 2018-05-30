'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Officialtesttemplate = mongoose.model('Officialtesttemplate'),
	_ = require('lodash');

/**
 * Create a Officialtesttemplate
 */
exports.create = function(req, res) {
	var officialtesttemplate = new Officialtesttemplate(req.body);
	officialtesttemplate.user = req.user;

    if(req.user.center !== undefined)
        officialtesttemplate.center = req.user.center;

	officialtesttemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtesttemplate);
		}
	});
};

/**
 * Show the current Officialtesttemplate
 */
exports.read = function(req, res) {
	res.jsonp(req.officialtesttemplate);
};

/**
 * Update a Officialtesttemplate
 */
exports.update = function(req, res) {
	var officialtesttemplate = req.officialtesttemplate ;

    var updatedData;
    if(req.body.json !== undefined)
    {
        try{
            updatedData = JSON.parse(req.body.json);
        } catch(err)
        {
            console.log("JSON parsing error");
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    }
    else {
        updatedData = req.body;
    }

	officialtesttemplate = _.extend(officialtesttemplate , updatedData);

	officialtesttemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtesttemplate);
		}
	});
};

/**
 * Delete an Officialtesttemplate
 */
exports.delete = function(req, res) {
	var officialtesttemplate = req.officialtesttemplate ;

	officialtesttemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtesttemplate);
		}
	});
};

/**
 * List of Officialtesttemplates
 */
exports.list = function(req, res) {
    var query = {};
    if(req.user.roles !== 'admin' && req.user.center !== undefined) {
        query = {$or : [
            { 'center' : new mongoose.Types.ObjectId(req.user.center) }
        ]};
    }
	Officialtesttemplate.find(query).sort('-created').populate('user', 'displayName').exec(function(err, officialtesttemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtesttemplates);
		}
	});
};

/**
 * Officialtesttemplate middleware
 */
exports.officialtesttemplateByID = function(req, res, next, id) { 
	Officialtesttemplate.findById(id).populate('user', 'displayName').exec(function(err, officialtesttemplate) {
		if (err) return next(err);
		if (! officialtesttemplate) return next(new Error('Failed to load Officialtesttemplate ' + id));
        if(req.user.roles !== 'admin' && req.user.center !== undefined) {
            if(req.user.center.equals(officialtesttemplate.center) == false)
            {
                return res.status(400).send("has no permission");
            }
        }
		req.officialtesttemplate = officialtesttemplate ;
		next();
	});
};

/**
 * Officialtesttemplate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.officialtesttemplate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
