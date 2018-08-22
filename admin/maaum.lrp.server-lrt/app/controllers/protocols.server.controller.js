'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Protocol = mongoose.model('Protocol'),
	Problem = mongoose.model('Problem'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Protocol
 */
exports.create = function(req, res) {

	var protocol;

	// Init Variables
	if(req.body.json !== undefined)
	{
		try{
			protocol = new Protocol(JSON.parse(req.body.json));
		} catch(err)
		{
			console.log(err);
			return res.status(400).send({
				message: "JSON parsing error" + err
			});
		}
	}
	else {
		return res.status(400).send({
			message: "Protocol JSON 파일이 필요합니다."
		});
	}

	protocol.user = req.user;
    if(req.user.center !== undefined)
        protocol.center = req.user.center;

	protocol.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(protocol);
		}
	});
};

/**
 * Show the current Protocol
 */
exports.read = function(req, res) {
	res.jsonp(req.LRPprotocol);
};

/**
 * Update a Protocol
 */
exports.update = function(req, res) {
	var protocol = req.LRPprotocol ;

	var updatedData;
	if(req.body.json !== undefined)
	{
		try{
			updatedData = JSON.parse(req.body.json);
		} catch(err)
		{
			console.log("JSON parsing error");
			return res.status(400).send({
				message: "JSON parsing error",
				json : req.body.json
			});
		}
	}
	else {
		updatedData = req.body;
	}

	updatedData.updated = Date.now();

	protocol = _.extend(protocol , updatedData);

	protocol.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(protocol);
		}
	});
};

/**
 * Delete an Protocol
 */
exports.delete = function(req, res) {
	var protocol = req.LRPprotocol ;

	protocol.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(protocol);
		}
	});
};

/**
 * List of Protocols
 */
exports.list = function(req, res) {
    var query = {};
    if(req.user.roles !== 'admin' && req.user.center !== undefined) {
        query = {$or : [
            { 'center' : new mongoose.Types.ObjectId(req.user.center) }
        ]};
    }
	Protocol.find(query).sort('-created').populate('user', 'name').exec(function(err, protocols) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var pp = [];
			protocols.forEach(function(protocol, index) {
				protocol.tasks.forEach(function(x, index) {
					if(x === null)
						protocol.tasks.pop(x);
				});
				pp.push(protocol);
			});
			res.jsonp(pp);
		}
	});
};

/**
 * Protocol middleware
 */
exports.protocolByID = function(req, res, next, id) {

	var options = {
		path: 'tasks.taskID',
		model: 'Task',
		select: {
			'name' : 1,
			'category' : 1
		}
	};


	Protocol.findById(id).populate('user', 'name').exec(function(err, protocol) {
		if (err) return next(err);
		if (! protocol) return next(new Error('Failed to load Protocol ' + id));
		//console.log(protocol);
		Protocol.populate(protocol, options, function(err, protocol2) {

			var t2 = [];
			async.eachSeries(protocol2.tasks, function iterator(task, callback){
				if(task === null) callback();
				else if(task.taskID === undefined) callback();
				else {
					Problem.findOne()
						.where({refTask: task.taskID._id})
						.sort('-name')
						.exec(function(err, obj)
						{
							if (err) {
								res.status(400).send("error" + err);
								callback();
							}
							else if(!obj) {
								t2.push(task);
								callback();
							}
							else {
								var max = obj.name;
								task.setSize = max;
								t2.push(task);
								callback();
							}
						}
					);
				}
			}, function done(err) {
				if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				else {
                    if(req.user.roles !== 'admin' && req.user.center !== undefined) {
                        if(req.user.center.equals(protocol2.center) == false)
                        {
                            return res.status(400).send("has no permission");
                        }
                    }
					protocol2.tasks = t2;
					req.LRPprotocol = protocol2;
					//console.log(protocol2);
					next();
				}
			});
		});
	});
};

/**
 * Protocol authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(['admin', 'therapist', 'doctor', 'manager'], req.user.roles).length) {
		next();
	}
	else if (req.LRPprotocol.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	} else {
		next();
	}
};
