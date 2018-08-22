'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    auth = require('./users.authorization.server.controller'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Admin Existance Check
 */
exports.hasAdmin = function(req, res) {
    console.log('test');
    User.find({ 'roles': 'admin' }).count().exec(function(err, hasAdmin) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(hasAdmin);
        }
    });
};

exports.userDT = function(req, res) {
    var conditions = {};

    User.find({ "center_name": null }).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            users.forEach(function(user) {
                user.center_name = "MAAUM";
                user.save();
            });
        }
    });

    console.log("userDT");

    if (req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    console.log(conditions);

    console.log(req.query);

    User.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        res.send(data);
    });
}

exports.therapistDT = function getData(req, res) {
    //"type.typeName" : "Trolley"
    //console.log("Getest for Data Table made with data: ", request.query);

    var conditions = {};
    conditions.roles = 'therapist';

    if (req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    console.log(conditions);

    User.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        res.send(data);
    });
};

exports.patientDT = function getData(req, res) {
    //"type.typeName" : "Trolley"
    var user = req.user;

    var conditions = {};
    conditions.roles = 'patient';

    if (req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    //if(user.roles.indexOf('therapist') > -1)
    //    conditions.assignedTherapist = user._id;

    //console.log("Getest for Data Table made with data: ", request.query);
    User.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        res.send(data);
        console.log(req.query);
    });
};

exports.therapistList = function getData(req, res) {
    var user = req.user;

    var where = {};
    where.roles = 'therapist';

    if (req.user.center !== undefined) {
        where.center = req.user.center;
    }

    var select = {
        salt: 0,
        provider: 0,
        password: 0,
        __v: 0
    };

    User.find(where, select).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(users);
        }
    });
};

exports.patientList = function getData(req, res) {
    var user = req.user;

    var where = {};
    where.roles = 'patient';

    if (req.user.center !== undefined) {
        where.center = req.user.center;
    }

    var pid;

    if (user.roles === 'therapist') // 평가자의 경우
        where.$or = [{ assignedTherapist: user._id }, { assignedTherapist: { $exists: false } }];

    if (req.params.therapistId !== undefined)
        where.$or = [{ assignedTherapist: req.params.therapistId }, { assignedTherapist: { $exists: false } }];

    console.log(where);

    //if(user.roles.indexOf('therapist') > -1)
    //    where.assignedTherapist = user._id;
    //
    //if(request.params.therapistId !== undefined)
    //    where.assignedTherapist = request.params.therapistId;

    var select = {
        salt: 0,
        provider: 0,
        password: 0,
        __v: 0
    };

    /*User.find(where, select).populate('assignedTherapist', select).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(users);
        }
    });*/

    User.find(where, select).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(users);
        }
    });
};

exports.doctorDT = function getData(req, res) {

    var conditions = {};
    conditions.roles = 'doctor';

    if (req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    User.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        res.send(data);
    });
};

exports.getProgressNotes = function(req, res) {
    var select = {
        "content": 0
    };
    User.findById(req.profile._id).populate('progressNotes', select).exec(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(user);
            res.json(user.progressNotes);
        }
    });
};

exports.getTherapist = function(req, res) {

    var select = {
        salt: 0,
        provider: 0,
        password: 0,
        __v: 0
    };

    User.findById(req.params.userId, select).exec(function(err, user) {
        if (user && user.roles === 'therapist') {
            res.json(user);
        } else {
            res.status(400).send({
                message: '해당 user는 열람할 수 없습니다.'
            });
        }
    });
};

exports.getManager = function(req, res) {

    console.log("getmanager");

    var select = {
        salt: 0,
        provider: 0,
        password: 0,
        __v: 0
    };

    User.findById(req.params.userId, select).exec(function(err, user) {
        if (user && user.roles === 'manager') {
            res.json(user);
        } else {
            res.status(400).send({
                message: '해당 user는 열람할 수 없습니다.'
            });
        }
    });
};

exports.getPatient = function(req, res) {

    var select = {
        salt: 0,
        provider: 0,
        password: 0,
        __v: 0
    };

    //{
    //    "_id": "561258e4a685c9d4c45bd093",
    //    "user": "54edcc90186747dc236efc9f",
    //    "patient": "54eeda9471215fbc19d4b09d",
    //    "template": {
    //    "_id": "56124349253dcf1088837d47",
    //        "user": "54edcc90186747dc236efc9f",
    //        "__v": 0,
    //        "created": "2015-10-05T09:30:49.208Z",
    //        "name": "실허증"
    //},
    //    "value": 10,
    //    "__v": 0,
    //    "created": "2015-10-05T11:03:00.252Z",
    //    "testDate": "2015-10-05T10:33:13.131Z",
    //    "name": "공식검사"

    var select2 = {
        user: 0,
        patient: 0,
        __v: 0
    }

    var options = {
        path: 'officialTests.template',
        model: 'Officialtesttemplate',
        select: 'name'
    };

    User.findById(req.params.userId, select).populate('assignedTherapist', select).populate('officialTests', select2).exec(function(err, user) {
        if (user && user.roles === 'patient') {
            User.populate(user, options, function(err, user2) {
                res.json(user2);
            });
        } else {
            res.status(400).send({
                message: '해당 user는 열람할 수 없습니다.'
            });
        }
    });
};