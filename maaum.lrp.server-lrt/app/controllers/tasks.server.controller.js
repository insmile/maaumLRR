'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Task = mongoose.model('Task'),
    Problem = mongoose.model('Problem'),
    async = require('async'),
    _ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
    var task = new Task(req.body);
    task.user = req.user;
    if (req.user.center !== undefined)
        task.center = req.user.center;

    task.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

exports.DT = function getData(req, res) {
    var conditions = {};

    conditions.$or = [{ 'isOpen': null }, { 'isOpen': true }];
    if (req.user.center !== undefined) {
        conditions.$or.push({ 'isOpen': false, 'center': req.user.center });
    }

    Task.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        console.log(req.query);
        if (err) console.log(err);
        res.send(data);
    });
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
    if (req.profile !== undefined) {
        console.log(req.profile);
    }
    var where = {};
    where.refTask = req.task._id;
    where.$or = [];
    where.$or.push({ 'isOpen': null });
    where.$or.push({ 'isOpen': true });

    console.log(req);
    if (req.user.center !== undefined)
        where.$or.push({ 'isOpen': false }, { 'center': req.user.center });

    Problem.findOne()
        .where(where)
        .sort('-name')
        .exec(function(err, obj) {
            if (err) {
                res.status(400).send("error" + err);
            } else if (!obj) {
                res.jsonp(req.task);
            } else {
                var max = obj.name;
                req.task.setSize = max;
                res.jsonp(req.task);

            }
        });
    //Problem.find({'refTask' : req.task._id}).max('name')
};

/**
 * Update a Task
 */
exports.update = function(req, res) {

    console.log(req);
    var task = req.task;

    console.log(req);

    task = _.extend(task, req.body);

    Problem.find({ 'refTask': task._id }, function(err, tasks) {
        tasks.forEach(function(problem, index) {
            problem.taskName = task.name;
            problem.taskCategory = task.category;
            console.log(problem);
            problem.save();
        })
    });

    //task._id

    task.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
    var task = req.task;

    task.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {
    var query = {};
    if (req.user.roles !== 'admin') {
        query = {
            $or: [
                { 'isOpen': null },
                { 'isOpen': true },
                { 'isOpen': false, 'center': new mongoose.Types.ObjectId(req.user.center) }
            ]
        };
    }

    Task.find(query).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var t2 = [];
            async.eachSeries(tasks, function iterator(task, callback) {
                Problem.findOne()
                    .where({ refTask: task._id })
                    .sort('-name')
                    .exec(function(err, obj) {
                        if (err) {
                            res.status(400).send("error" + err);
                            callback();
                        } else if (!obj) {
                            t2.push(task);
                            callback();
                        } else {
                            var max = obj.name;
                            task.setSize = max;
                            t2.push(task);
                            callback();
                        }
                    });
            }, function done(err) {
                if (err) return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
                else {
                    res.jsonp(t2);
                }
            });
        }
    });
};

exports.category = function(req, res) {
    Task.find().distinct('category').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

exports.name = function(req, res) {
    Task.find().distinct('name').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

exports.list_a = function(req, res) {

    var query = {};
    if (req.user.roles !== 'admin') {
        query = {
            $or: [
                { 'isOpen': null },
                { 'isOpen': true },
                { 'isOpen': false, 'center': new mongoose.Types.ObjectId(req.user.center) }
            ]
        };
    }

    Task.find(query, { _id: 1, category: 1, name: 1 }).sort('sortOrder').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var c = [];
            var t = [];
            var cc;
            tasks.forEach(function(x, index) {
                //console.log(t.indexOf(x.category));
                if (c[x.category] === undefined) {
                    c[x.category] = [];
                    cc = { category: x.category, tasks: [] };
                    t.push(cc);
                }
                cc.tasks.push({ name: x.name, _id: x._id });
            });
            //console.log(t);
            //console.log(JSON.stringify(t));
            res.jsonp(t);
        }
    });
};

exports.info = function(req, res) {
    var taskInfo = {};
    taskInfo.answer = req.task.answer;
    taskInfo.resources = req.task.resources;
    res.jsonp(taskInfo);
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
    Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
        if (err) return next(err);
        if (!task) return next(new Error('Failed to load Task ' + id));
        if (req.user.roles !== 'admin' && req.user.center !== undefined) {
            if (task.isOpen == false && req.user.center.equals(task.center) == false) {
                return res.status(400).send("has no permission");
            }
        }
        req.task = task;
        next();
    });
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.task.user.id !== req.user.id) {
    	return res.status(403).send('User is not authorized');
    }*/
    next();
};