'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Takehome = mongoose.model('Takehome'),
	User = mongoose.model('User'),
	Task = mongoose.model('Task'),
	Protocol = mongoose.model('Protocol'),
	_ = require('lodash');

/**
 * Create a Takehome
 */
exports.create = function(req, res) {
	// 필수 변수 확인

	var save = function() {
		takehome.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(takehome);
			}
		});
	};

	if(req.body.patientID === undefined) return res.status(400).send("no patient ID");
	if(req.body.taskID === undefined && req.body.protocolID === undefined) return res.status(400).send("no task ID and no protocol ID");
	if(req.body.taskID !== undefined && req.body.protocolID !== undefined) return res.status(400).send("please input a task ID or a protocol ID alone.");
	if(req.body.taskID !== undefined && req.body.setNum === undefined) return res.status(400).send("no setNum");

	var takehome = new Takehome();
	if(req.body.expired !== undefined)
		takehome.expired = req.body.expired;

	User.findOne({'_id':req.body.patientID}).exec(function(err, user) {
		if(err) return res.status(400).send("no patient found : " + err);
		else {
			takehome.patient = req.body.patientID;
			takehome.assigner = req.user._id;
			if(req.body.taskID !== undefined) {
				takehome.isProtocol = false;
				Task.findOne({'_id':req.body.taskID}).exec(function(err, task) {
					if(err) return res.status(400).send("no task found");
					else {
						takehome.task = req.body.taskID;
						takehome.setNum = req.body.setNum;
						takehome.name = task.name;
						save();
					}
				});
			} else if(req.body.protocolID !== undefined) {
				takehome.isProtocol = true;
				Protocol.findOne({'_id':req.body.protocolID}).exec(function(err, protocol){
					if(err) return res.status(400).send("no protocol found");
					else {
						takehome.protocol = req.body.protocolID;
						takehome.name = protocol.name;
						save();
					}
				});
			}
		}
	});
};

/**
 * Show the current Takehome
 */
exports.read = function(req, res) {
	res.jsonp(req.takehome);
};

/**
 * Update a Takehome
 */
exports.update = function(req, res) {
	var takehome = req.takehome ;

	takehome = _.extend(takehome , req.body);

	takehome.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(takehome);
		}
	});
};

/**
 * Delete an Takehome
 */
exports.delete = function(req, res) {
	var takehome = req.takehome ;

	takehome.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(takehome);
		}
	});
};

/**
 * List of Takehomes
 */
exports.list = function(req, res) { 
	Takehome.find().sort('-created').populate('assigner', 'name').exec(function(err, takehomes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(takehomes);
		}
	});
};

exports.listByPatient = function(req, res) {

	console.log(req.profile);

	var isPatient = true;

	if(_.contains(['admin', 'therapist', 'doctor', 'manager'], req.user.roles) === true) {
		isPatient = false;
	}

	var where = {};
	where.patient = req.profile._id;

	if(isPatient) {
		where.$or = [{expired : {$gt : Date.now()}}, {expired : {$exists : false}}];
	}

	var select = {
		__v:0
	};

	Takehome.find(where).sort('-created').populate('assigner', 'name').exec(function(err, takehomes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(takehomes);
		}
	});
};

/**
 * Takehome middleware
 */
exports.takehomeByID = function(req, res, next, id) {
	var options = {
		path: 'refResults.refProtocol',
		model: 'Protocol',
		select : 'name'
	};

	var options2 = {
		path : 'refResults.refTask',
		model : 'Task',
		select : 'name'
	};

	Takehome.findById(id).populate('refResults', {'name' : 1, 'created' : 1, 'refProtocol' : 1}).populate('task').populate('protocol').exec(function(err, takehome) {
		if (err) return next(err);
		if (! takehome) return next(new Error('Failed to load Takehome ' + id));
		Takehome.populate(takehome, options, function(err, takehome2) {
			Takehome.populate(takehome2, options, function(err, takehome3) {
				req.takehome = takehome3;
				next();
			});
		});
	});
};

/**
 * Takehome authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.takehome.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
