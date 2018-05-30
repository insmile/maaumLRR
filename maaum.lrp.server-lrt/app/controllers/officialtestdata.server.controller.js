'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
	Officialtestdatum = mongoose.model('Officialtestdatum'),
	_ = require('lodash');

/**
 * Create a Officialtestdatum
 */
exports.create = function(req, res) {

	if(req.body.patient === undefined) {
		res.status(400).send("please input a patient ID");
	}

	var officialtestdatum = new Officialtestdatum(req.body);
	officialtestdatum.user = req.user;

	officialtestdatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			User.findOne({'_id' : req.body.patient}).exec(function(err, patient) {
				if(err) {
					res.status(400).send('invalid patient ID');
				} else {
					if(patient.officialTests.indexOf(officialtestdatum._id) < 0) {
						patient.officialTests.push(officialtestdatum._id);
						patient.save(function(err) {
							if(err)
							{
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								res.jsonp(officialtestdatum);
							}
						})
					}
				}
			});
		}
	});
};

/**
 * Show the current Officialtestdatum
 */
exports.read = function(req, res) {
	res.jsonp(req.officialtestdatum);
};

/**
 * Update a Officialtestdatum
 */
exports.update = function(req, res) {
	var officialtestdatum = req.officialtestdatum ;

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

	officialtestdatum = _.extend(officialtestdatum , updatedData);

	officialtestdatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtestdatum);
		}
	});
};

/**
 * Delete an Officialtestdatum
 */
exports.delete = function(req, res) {
	var officialtestdatum = req.officialtestdatum ;

	officialtestdatum.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			User.findOne({'_id' : req.officialtestdatum.patient}).exec(function(err, patient) {
				if(err) {
					res.status(400).send('invalid patient ID');
				} else {
					if(patient.officialTests.indexOf(officialtestdatum._id) >= 0) {
						var idx = patient.officialTests.indexOf(officialtestdatum._id);
						patient.officialTests.splice(idx, 1);
						patient.save(function(err) {
							if(err)
							{
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								res.jsonp(officialtestdatum);
							}
						})
					} else {
						res.jsonp(officialtestdatum);
					}
				}
			});
		}
	});
};

/**
 * List of Officialtestdata
 */
exports.list = function(req, res) { 
	Officialtestdatum.find().sort('-created').populate('user', 'name').populate('patient', 'name').populate('template', 'name').exec(function(err, officialtestdata) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtestdata);
		}
	});
};

exports.listByPatient = function(req, res) {
	console.log(req.profile);
	Officialtestdatum.find({'patient' : req.profile._id}).sort('-created').populate('patient', 'name').populate('user', 'name').populate('template', 'name').exec(function(err, officialtestdata) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(officialtestdata);
		}
	});
};

/**
 * Officialtestdatum middleware
 */
exports.officialtestdatumByID = function(req, res, next, id) { 
	Officialtestdatum.findById(id).populate('user', 'displayName').exec(function(err, officialtestdatum) {
		if (err) return next(err);
		if (! officialtestdatum) return next(new Error('Failed to load Officialtestdatum ' + id));
		req.officialtestdatum = officialtestdatum ;
		next();
	});
};

/**
 * Officialtestdatum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.officialtestdatum.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
