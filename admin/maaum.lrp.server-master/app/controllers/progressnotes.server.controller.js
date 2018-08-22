'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Progressnote = mongoose.model('Progressnote'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create a Progressnote
 */
exports.create = function (req, res) {
    // Init Variables
    if(req.body.json !== undefined)
    {
        try{
            var progressnote = new Progressnote(JSON.parse(req.body.json));
            progressnote.user = req.user;
        } catch(err)
        {
            console.log(err);
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    }
    else {
        var progressnote = new Progressnote(req.body);
    }

    if (req.body.patientID === undefined) {
        return res.status(400).send({
            message: "patient id 설정이 필요합니다."
        });
    }

    progressnote.save(function (err) {
        console.log ("saving");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            User.findById(req.body.patientID).exec(function (err, user) {
                user.progressNotes.push(progressnote._id);
                user.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(progressnote);
                    }
                });
            });
        }
    });
};

/**
 * Show the current Progressnote
 */
exports.read = function (req, res) {
    res.jsonp(req.progressnote);
};

/**
 * Update a Progressnote
 */
exports.update = function (req, res) {
    var progressnote = req.progressnote;

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

    updatedData.updated = Date.now();

    progressnote = _.extend(progressnote, updatedData);

    progressnote.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(progressnote);
        }
    });
};

/**
 * Delete an Progressnote
 */
exports.delete = function (req, res) {
    var progressnote = req.progressnote;

    console.log(progressnote);

    //db.getCollection('users').find({ progressNotes : { $in : [ObjectId("55e80438bd8bc334445c650d")]}})

    progressnote.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            /*Person.
                find({
                    occupation: /host/,
                    'name.last': 'Ghost',
                    age: { $gt: 17, $lt: 66 },
                    likes: { $in: ['vaporizing', 'talking'] }
                }).
                limit(10).
                sort({ occupation: -1 }).
                select({ name: 1, occupation: 1 }).
                exec(callback);*/
            /*db.getCollection('users').find({ progressNotes : { $in : [ObjectId("55e80438bd8bc334445c650d")]}})*/
            console.log(progressnote);
            User.find({ progressNotes : { $in : [progressnote._id] } }).exec(function(err, users){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    users.forEach(function(user, index) {
                        console.log(user);
                        var idx = user.progressNotes.indexOf(progressnote._id);
                        if(idx > -1) {
                            user.progressNotes.splice(idx, 1);
                            user.save(function(err) {
                               if(err) {
                                   return res.status(400).send({
                                       message: errorHandler.getErrorMessage(err)
                                   });
                               }
                            });
                        }
                    });

                    res.send("ok");
                }
            });
            //res.jsonp(progressnote);
        }
    });
};

/**
 * List of Progressnotes
 */
exports.list = function (req, res) {
    Progressnote.find().sort('-created').populate('user', 'displayName').exec(function (err, progressnotes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(progressnotes);
        }
    });
};

exports.listByUser = function (req, res) {

    //req.profile

    Progressnote.find().sort('-created').populate('user', 'displayName').exec(function (err, progressnotes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(progressnotes);
        }
    });
};

/**
 * Progressnote middleware
 */
exports.progressnoteByID = function (req, res, next, id) {

    Progressnote.findById(id).populate('user', 'displayName').exec(function (err, progressnote) {
        if (err) return next(err);
        if (!progressnote) return next(new Error('Failed to load Progressnote ' + id));
        req.progressnote = progressnote;
        next();
    });
};

/**
 * Progressnote authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (_.contains(['admin', 'therapist', 'doctor'], req.user.roles) === true) {
        next();
    }
    else if(req.progressnote.user === null || req.progressnote.user === undefined) {
        next();
    }
    else if (req.progressnote.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    else {
        next();
    }
};
