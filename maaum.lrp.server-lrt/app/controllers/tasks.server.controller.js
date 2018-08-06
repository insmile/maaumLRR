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
    console.log("DDJJ create");
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
    console.log("DDJJ DT getData");
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
    console.log("DDJJ read");
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
    console.log("DDJJ update");
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
        console.log("DDJJ save");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

exports.update_Sever = function(req, res) {
    console.log("DDJJ update_Sever");

    var task = req.task;

    task = _.extend(task, req.body);

    Problem.find({ 'refTask': task._id }, function(err, tasks) {
        tasks.forEach(function(problem, index) {
            problem.taskName = task.name;
            problem.taskCategory = task.category;
            
            problem.save();
        })
    });

    //task._id

    task.save(function(err) {
        console.log("DDJJ save11");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

exports.test_clientService = function(req, res) {
    console.log("DDJJ test_clientService");

    var task = req.task;

    task = _.extend(task, req.body);

    Problem.find({ 'refTask': task._id }, function(err, tasks) {
        tasks.forEach(function(problem, index) {
            
            console.log("DDJJ index  :" + index);
            console.log("DDJJ task.name  :" + task.name);
            console.log("DDJJ task.category  :" + task.category);
            problem.taskName = task.name;
            problem.taskCategory = task.category;
            
            problem.save();
        })
    });

    //task._id

    task.save(function(err) {
        console.log("DDJJ save11");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log("DDJJ task" + task);
            res.jsonp(task);
        }
    });
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
    var task = req.task;
    console.log("DDJJ delete");
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
    console.log("DDJJ list");
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
    console.log("DDJJ category");
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
    console.log("DDJJ name");
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
    console.log("DDJJ list_a");
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
    
    query = { type: 'LRE' };
    
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

/** free lt 훈련 */
exports.list_b = function(req, res) {
    console.log("DDJJ list_b");
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
    query = { type: 'LT' };
    
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
            console.log(JSON.stringify(t));
            res.jsonp(t);
        }
    });
};

/** free rt 훈련 */
exports.list_c = function(req, res) {
    console.log("DDJJ list_c");
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
    query = { type: 'RT' };
    
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
            console.log(JSON.stringify(t));
            res.jsonp(t);
        }
    });
};


exports.info = function(req, res) {
    console.log("DDJJ info");
    var taskInfo = {};
    taskInfo.answer = req.task.answer;
    taskInfo.resources = req.task.resources;

    taskInfo.taskGb = req.task.taskGb;
    
    res.jsonp(taskInfo);
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
    console.log("DDJJ taskByID");
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
    console.log("DDJJ hasAuthorization");
    /*if (req.task.user.id !== req.user.id) {
    	return res.status(403).send('User is not authorized');
    }*/
    next();
};