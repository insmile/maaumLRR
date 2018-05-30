'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Result = mongoose.model('Result'),
    Takehome = mongoose.model('Takehome'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create a Result
 */
exports.create = function(req, res) {

    var result;

    // Init Variables
    if (req.body.json !== undefined) {
        try {
            result = new Result(JSON.parse(req.body.json));
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                message: "JSON parsing error" + err
            });
        }
    } else {
        return res.status(400).send({
            message: "Result JSON 파일이 필요합니다."
        });
    }

    if (req.body.patientID === undefined) {
        return res.status(400).send({
            message: "patientID 설정이 필요합니다."
        });
    }

    result.user = req.body.patientID;

    result.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: err,
                data: result
            });
        } else {
            if (result.refTakehome !== undefined && result.refTakehome != null) {
                Takehome.findOne({ "_id": result.refTakehome }).exec(function(err, takehome) {
                    if (err) {
                        return res.status(400).send({
                            message: err,
                            data: result
                        });
                    } else {
                        if (takehome.refResults.indexOf(result._id) < 0) {
                            takehome.refResults.push(result._id);
                            takehome.save(function(err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: err
                                    });
                                } else {
                                    res.jsonp(result);
                                }
                            })
                        } else {
                            res.jsonp(result);
                        }
                    }
                });
            } else {
                res.jsonp(result);
            }
        }
    });
};

/**
 * Show the current Result
 */
exports.read = function(req, res) {
    res.jsonp(req.result);
};

/**
 * Update a Result
 */
exports.update = function(req, res) {

    var result = req.result;

    var updatedData;
    if (req.body.json !== undefined) {
        try {
            updatedData = JSON.parse(req.body.json);
        } catch (err) {
            console.log("JSON parsing error");
            return res.status(400).send({
                message: "JSON parsing error",
                json: req.body.json
            });
        }
    } else {
        updatedData = req.body;
    }

    updatedData.updated = Date.now();

    result = _.extend(result, updatedData);

    result.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
                data: result
            });
        } else {
            res.jsonp(result);
        }
    });
};

/**
 * Delete an Result
 */
exports.delete = function(req, res) {
    var result = req.result;

    result.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (result.refTakehome !== undefined) {
                Takehome.findOne({ "_id": result.refTakehome }).exec(function(err, takehome) {
                    if (err) {
                        res.jsonp(result);
                    } else {
                        if (takehome.refResults.indexOf(result._id) >= 0) {
                            var idx = takehome.refResults.indexOf(result._id);
                            takehome.refResults.splice(idx, 1);
                            takehome.save(function(err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    res.jsonp(result);
                                }
                            })
                        } else {
                            res.jsonp(result);
                        }
                    }
                });
            }
        }
    });
};

/**
 * List of Results
 */
exports.list = function(req, res) {
    Result.find().sort('-created').populate('user', 'name').exec(function(err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });
};


/**
 * List of Results
 */
exports.listByPatient = function(req, res) {

    Result.find({ 'patientID': req.patient._id }).sort('-created').populate('user', 'displayName').exec(function(err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });
};

/**
 * Result middleware
 */
exports.resultByID = function(req, res, next, id) {
    Result.findById(id).populate('user', 'displayName').exec(function(err, result) {
        if (err) return next(err);
        if (!result) return next(new Error('Failed to load Result ' + id));
        req.result = result;
        next();
    });
};

/**
 * Result middleware
 */
exports.resultByID = function(req, res, next, id) {
    var options = {
        path: 'tasks.problems.refProblem',
        model: 'Problem'
    };

    var options2 = {
        path: 'tasks.refTask',
        model: 'Task',
        select: {
            'name': 1,
            'category': 1
        }
    };
    Result.findById(id).populate('user', 'displayName').exec(function(err, result) {
        if (err) return next(err);
        if (!result) return next(new Error('Failed to load Result ' + id));
        Result.populate(result, options, function(err, result2) {
            Result.populate(result2, options2, function(err, result3) {
                result3.tasks.forEach(function(t, idx) {
                    t.problems.forEach(function(p, idx) {
                        console.log(p);
                        p.refProblem.resources.forEach(function(r, idx) {
                            if (r.isDefinition) {
                                p.refProblem.def.push(r);
                            } else {
                                p.refProblem.res.push(r);
                            }
                        });
                    })
                });
                req.result = result3;
                next();
            });
        });
    });
};

/**
 * Result middleware
 */
exports.patientByID = function(req, res, next, id) {
    User.findById(id).exec(function(err, result) {
        if (err) return next(err);
        if (!result) return next(new Error('Failed to load Result ' + id));
        req.patient = result;
        next();
    });
};

/**
 * Result authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.result.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};