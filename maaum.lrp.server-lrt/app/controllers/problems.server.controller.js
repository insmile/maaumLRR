'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Problem = mongoose.model('Problem'),
    Center = mongoose.model('Center'),
    Task = mongoose.model('Task'),
    _ = require('lodash');

/**
 * Create a Problem
 */
exports.create = function(req, res) {
    var problem = new Problem(req.body);
    problem.user = req.user;

    Task.findById(problem.refTask).exec(function(err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            problem.taskCategory = task.category;
            problem.taskName = task.name;

            problem.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(problem);
                    return;
                }
            });
        }
    });
};

exports.DT = function getData(req, res) {
    getTaskList(req, res, getData2);
};

function getData2(req, res, taskList) {
    var conditions = {};
    conditions.refTask = { $in: taskList };

    Problem.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        console.log(data);
        res.send(data);
    });
}

function getTaskList(req, res, callback) {

    console.log(req.user);

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

    Task.find(query, { _id: 1 }).exec(function(err, tasks) {
        if (tasks === null) return [];
        if (tasks === undefined) return [];

        callback(req, res, tasks.map(function(task) {
            return task._id;
        }));
    });
}
/**
 * Show the current Problem
 */
exports.read = function(req, res) {
    res.jsonp(req.problem);
};

/**
 * Update a Problem
 */
exports.update = function(req, res) {
    var problem = req.problem;

    problem = _.extend(problem, req.body);

    Task.findById(problem.refTask).exec(function(err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            problem.taskCategory = task.category;
            problem.taskName = task.name;

            problem.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(problem);
                    return;
                }
            });
        }
    });
};

/**
 * Delete an Problem
 */
exports.delete = function(req, res) {
    var problem = req.problem;

    problem.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(problem);
        }
    });
};

/**
 * List of Problems
 */
exports.list = function(req, res) {
    Problem.find().sort('-created').populate('user', 'name').populate('refTask', 'center isOpen').exec(function(err, problems) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(problems.filter(function(problem) {
                if (problem.refTask.center === undefined) return true;
                else if (problem.refTask.isOpen === true) return true;
                else if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center)) return true;
                return false;
            }));
        }
    });
};

exports.listByTask = function(req, res) {
    if (req.body.taskID === undefined) {
        return res.status(400).send({
            message: "taskID가 필요합니다."
        });
    }
    if (req.body.setNum === undefined) {
        return res.status(400).send({
            message: "setNO가 필요합니다."
        });
    }
    var taskID = req.body.taskID;
    var setNO = req.body.setNum;

    Problem.find({
        'refTask': taskID,
        'name': setNO
    }).populate('refTask', 'center isOpen').sort('seq').exec(function(err, problems) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var rst = [];
            problems = problems.filter(function(problem) {
                if (problem.refTask.center === undefined) return true;
                else if (problem.refTask.isOpen === true) return true;
                else if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center)) return true;
                return false;
            });
            problems.forEach(function(x, index) {
                var p = {};
                p._id = x._id;
                if (x.practice !== undefined)
                    p.practice = x.practice;
                p.seq = x.seq;
                p.def = [];
                p.res = [];
                x.resources.forEach(function(x, index) {
                    var r = {};
                    r._id = x._id;
                    r.value = x.value;
                    r.name = x.name;
                    r.resType = x.resType;
                    if (x.isDefinition === true) {
                        p.def.push(r);
                    } else {
                        r.isAnswer = x.isAnswer;
                        p.res.push(r);
                    }
                });
                rst.push(p);
            });
            res.jsonp(rst);
            //res.jsonp(problems);
        }
    });
};

/**
 * Problem middleware
 */
exports.problemByID = function(req, res, next, id) {
    console.log("in");
    Problem.findById(id).populate('user', 'name').populate('refTask', 'name center isOpen').exec(function(err, problem) {
        if (err) return next(err);
        if (!problem) return next(new Error('Failed to load Problem ' + id));

        if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center) === false) {
            return res.status(400).send("has no permission");
        } else {
            req.problem = problem;
            next();
        }
    });
};

/**
 * Problem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.problem.user.id !== req.user.id) {
     return res.status(403).send('User is not authorized');
     }*/
    next();
};


exports.updatedb = function(req, res) {

    Problem.find({ 'name': { $type: 2 } }, function(err, problems) {
        problems.forEach(function(x, index) {
            delete x.name;
            var intName = parseInt(x.name);
            x.name = new Number();
            x.name = intName; // convert field to string
            console.log(x.seq);
            if (x.seq === undefined) {
                x.seq = x.level;
            }
            console.log(x.seq);
            x.save();
        });
    });

    return res.send("ok");
};