'use strict';

module.exports = function(app) {
	var payHistories = require('../../app/controllers/payhistory.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    var centers = require('../../app/controllers/centers.server.controller');

	// Pay Routes
	app.route('/pay')
		.get(users.requiresLogin, payHistories.hasAuthorization, payHistories.list)
		.post(users.requiresLogin, payHistories.hasAuthorization, payHistories.create);

    app.route('/pay/DT')
        .get(users.requiresLogin, payHistories.hasAuthorization, payHistories.DT);

    app.route('/pay/create')
        .post(users.requiresLogin, payHistories.hasAuthorization, payHistories.create);

    app.route('/pay/activation/:payId')
		.get(users.requiresLogin, payHistories.isAdmin, payHistories.activation);

	app.route('/pay/:payId')
		.get(users.requiresLogin, payHistories.read)
		.put(users.requiresLogin, payHistories.hasAuthorization, payHistories.update)
        .post(users.requiresLogin, payHistories.hasAuthorization, payHistories.update)
		.delete(users.requiresLogin, payHistories.hasAuthorization, payHistories.delete);

	app.route('/pay/key/:centerId')
		.get(users.requiresLogin, payHistories.hasAuthorization, payHistories.getkeynum);

	// Finish by binding the Center middleware
	app.param('payId', payHistories.payById);
	app.param('centerId', centers.centerByID);
};
