'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    User = mongoose.model('User'),
    Center = mongoose.model('Center'),
    PayHistory = mongoose.model('PayHistory'),
    pay = require('./payhistory.server.controller'),
    _ = require('lodash');

/**
 * Create a center
 */
exports.create = function(req, res) {

    // Init Variables
    if (req.body.json !== undefined) {
        try {
            console.log(req.body.json);
            var center = new Center(JSON.parse(req.body.json));
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    } else {
        var center = new Center(req.body);
    }

    center.save(function(err) {
        console.log("saving");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var p = PayHistory();

            p.center = center._id;
            p.center_id = center.center_id;
            p.center_name = center.name;
            p.product_name = "가입 축하 7일권";
            p.price = 0;
            p.key_num = 10;
            p.period = 7;
            p.request_date = Date.now();
            p.approved = true;
            p.approved_date = Date.now();
            p.start_date = Date.now();
            var d = new Date();
            d.setDate(d.getDate() + p.period);
            p.expired_date = d;

            p.save(function(err) {
                if (err) {
                    console.log(err);
                }
                res.jsonp(center);
            })
        }
    });
};

/**
 * Show the current center
 */
exports.read = function(req, res) {
    res.jsonp(req.center);
};

exports.expired = function(req, res) {

};

/**
 * Update a center
 */
exports.update = function(req, res) {
    var center = req.center;

    console.log('in');

    var updatedData;
    if (req.body.json !== undefined) {
        try {
            updatedData = JSON.parse(req.body.json);
        } catch (err) {
            console.log("JSON parsing error");
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    } else {
        updatedData = req.body;
    }

    updatedData.updated = Date.now();

    center = _.extend(center, updatedData);

    center.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            User.find({ 'center': center._id }).exec(function(err, users) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    _.forEach(users, function(user) {
                        user.center_name = center.name;
                        user.save();
                    });
                    res.jsonp(center);
                }
            });
            //res.jsonp(center);
        }
    });
    //res.jsonp(center);
};

/**
 * Delete an center
 */
exports.delete = function(req, res) {
    var center = req.center;

    console.log(center);

    //db.getCollection('users').find({ progressNotes : { $in : [ObjectId("55e80438bd8bc334445c650d")]}})

    center.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send("ok");
        }
    });
};

/**
 * List of center
 */
exports.list = function(req, res) {
    Center.find().sort('-created').exec(function(err, centers) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(centers);
        }
    });
};

/**
 * Progressnote middleware
 */
exports.centerByID = function(req, res, next, id) {

    Center.findById(id).exec(function(err, center) {
        if (err) return next(err);
        if (!center) return next(new Error('Failed to load Center ' + id));
        req.center = center;
        next();
    });
};

/**
 * centers authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.user.roles === 'admin') {
        next();
    } else if (req.user.roles === 'manager' && req.user.center.equals(req.center.id)) {
        next();
    } else {
        return res.status(403).send('User is not authorized');
    }
};

exports.DT = function getData(req, res) {
    Center.dataTable(req.query, {}, function(err, data) {
        if (err) console.log(err);
        console.log(data);
        res.send(data);
    });
};