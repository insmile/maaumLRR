'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    User = mongoose.model('User'),
    Product = mongoose.model('Product'),
    _ = require('lodash');

/**
 * Create a product
 */
exports.create = function (req, res) {
    // Init Variables
    if (req.body.json !== undefined) {
        try {
            console.log(req.body.json);
            var product = new Product(JSON.parse(req.body.json));
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                message: "JSON parsing error"
            });
        }
    }
    else {
        var product = new Product(req.body);
    }

    product.save(function (err) {
        console.log("saving");
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.jsonp(product);
        }
    });
};

/**
 * Show the current product
 */
exports.read = function (req, res) {
    res.jsonp(req.product);
};

/**
 * Update a product
 */
exports.update = function (req, res) {
    var product = req.product;

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
    }
    else {
        updatedData = req.body;
    }

    updatedData.updated = Date.now();

    product = _.extend(product, updatedData);

    product.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(product);
        }
    });
};

/**
 * Delete an product
 */
exports.delete = function (req, res) {
    var product = req.product;

    console.log(product);

    product.remove(function (err) {
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
 * List of product
 */
exports.list = function (req, res) {
    Product.find().sort('-created').exec(function (err, products) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(products);
        }
    });
};

exports.DT = function getData(req, res) {
    Product.dataTable(req.query, {}, function (err, data) {
        if (err) console.log(err);
        console.log(data);
        res.send(data);
    });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

    Product.findById(id).exec(function (err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Failed to load Center ' + id));
        req.product = product;
        next();
    });
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles === 'admin') {
        next();
    }
    else  {
        return res.status(403).send('User is not authorized');
    }
};
