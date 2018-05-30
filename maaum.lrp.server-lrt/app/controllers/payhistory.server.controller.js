'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    util = require('./util.server.controller'),
    User = mongoose.model('User'),
    Center = mongoose.model('Center'),
    Product = mongoose.model('Product'),
    PayHistory = mongoose.model('PayHistory'),
    _ = require('lodash');


var savePay = function(payHistory) {
    return new Promise(function(resolve, reject) {
        payHistory.save(function(err) {
            if (err)
                reject(err);
            else
                resolve("ok");
        })
    });
};

var getCenter = function(centerId) {
    console.log("getCenter : " + centerId);
    return new Promise(function(resolve, reject) {
        Center.findById(centerId).exec(function(err, center) {
            if (err) reject(err);
            else resolve(center);
        });
    });
};

var getProduct = function(productId) {
    console.log("productId : " + productId);
    return new Promise(function(resolve, reject) {
        Product.findById(productId).exec(function(err, product) {
            console.log("product find by Id err : " + err);
            console.log("product find by Id product : " + product);
            if (err) reject(err);
            else resolve(product);
        });
    })
};

var checkCenterPermission = function(center, user, approved) {
    return new Promise(function(resolve, reject) {
        if (user.roles === 'admin')
            resolve(center);
        else if (user.roles === 'manager' && user.center.toString() === center._id.toString())
            resolve(center);
        else
            reject("access failed");
    });
};

/**
 * Create a center
 */
exports.create = function(req, res) {
    // Init Variables
    if (req.body.json !== undefined) {
        try {
            console.log(req.body.json);
            var pay = new PayHistory(JSON.parse(req.body.json));
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    } else {
        var pay = new PayHistory(req.body);
    }

    console.log(pay);

    getCenter(pay.center)
        .then(function(center) {
            pay.center_name = center.name;
            pay.center_id = center.center_id;
            return checkCenterPermission(center, req.user, undefined);
        })
        .then(function(center) {
            return getProduct(pay.product)
        })
        .then(function(product) {
            pay.product_name = product.name;
            pay.price = product.price;
            pay.period = product.period;
            pay.key_num = product.keys;
            return savePay(pay);
        })
        .then(function(result) {
            res.jsonp(pay);
        })
        .catch(function(err) {
            console.log(err);
            res.status(400).send({
                message: err
            });
        });
};

/**
 * Show the current center
 */
exports.read = function(req, res) {
    res.jsonp(req.payHistory);
};

exports.expired = function(req, res) {

};

/**
 * Update a payment
 */
exports.update = function(req, res) {
    var pay = req.payHistory;

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

    // 보안을 위해 activation 관련 변수는 제거
    delete updatedData.approved;
    delete updatedData.refund;
    delete updatedData.price;
    delete updatedData.key_num;
    delete updatedData.approved_date;
    delete updatedData.expired_date;

    updatedData.updated = Date.now();

    pay = _.extend(pay, updatedData);

    console.log(pay);

    getCenter(pay.center)
        .then(function(center) {
            pay.center_name = center.name;
            pay.center_id = center.center_id;
            return checkCenterPermission(center, req.user, pay.approved);
        })
        .then(function(center) {
            return getProduct(pay.product);
        })
        .then(function(product) {
            pay.product_name = product.name;
            pay.price = product.price;
            pay.period = product.period;
            pay.key_num = product.keys;
            return savePay(pay);
        })
        .then(function(result) {
            res.jsonp(pay);
        })
        .catch(function(err) {
            res.status(400).send({
                message: err
            });
        });
};

/**
 * Delete an payment
 */
exports.delete = function(req, res) {
    var pay = req.payHistory;

    console.log(pay);

    getCenter(pay.center)
        .then(function(center) {
            return checkCenterPermission(center, req.user, pay.approved);
        })
        .then(function(center) {
            pay.remove(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.send("ok");
                }
            });
        })
        .catch(function(err) {
            res.status(400).send({
                message: err
            });
        });
};

/**
 * List of payments
 */
exports.list = function(req, res) {
    PayHistory.find().sort('-created').exec(function(err, payments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(payments);
        }
    });
};

/**
 * Progressnote middleware
 */
exports.payById = function(req, res, next, id) {

    PayHistory.findById(id).exec(function(err, pay) {
        if (err) return next(err);
        if (!pay) return next(new Error('Failed to load Payment ' + id));
        req.payHistory = pay;
        next();
    });
};

exports.activation = function(req, res) {

    var pay = req.payHistory;
    pay.approved = !pay.approved;

    if (pay.approved === true) {
        pay.approved_date = Date.now();
        if (pay.expired_date === undefined) {
            if (pay.start_date > Date.now()) {
                pay.expired_date = util.addDays(pay.period, pay.start_date);
            } else {
                pay.expired_date = util.addDays(pay.period);
            }
        }
    } else {
        pay.approved_date = undefined;
    }

    savePay(pay)
        .then(function(result) {
            res.send(result);
        })
        .catch(function(err) {
            res.status(400).send({
                message: err
            });
        });
};

exports.getkeynum = function(req, res) {
    util.getkeynum(req.center._id)
        .then(function(keyObj) {
            res.send(keyObj);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
};

/**
 * centers authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.user.roles === 'admin') {
        next();
    } else if (req.user.roles === 'manager') {
        next();
    } else {
        return res.status(403).send('User is not authorized');
    }
};

exports.isAdmin = function(req, res, next) {
    if (req.user.roles === 'admin') {
        next();
    } else {
        return res.status(403).send('User is not authorized');
    }
};

exports.DT = function getData(req, res) {
    /**
     * 
     * if(req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    User.dataTable(req.query, {'conditions':conditions}, function (err, data) {
        if(err) console.log(err);
        res.send(data);
    });
     * 
     */
    var conditions = {};
    console.log(req.user);
    if (req.user.center !== undefined) {
        conditions.center = req.user.center;
    }

    PayHistory.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        console.log(data);
        console.log(req.query);
        res.send(data);
    });
};