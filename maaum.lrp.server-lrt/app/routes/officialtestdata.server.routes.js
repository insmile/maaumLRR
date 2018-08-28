'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var officialtestdata = require('../../app/controllers/officialtestdata.server.controller');

	// Officialtestdata Routes
	app.route('/officialtestdata')
		.get(officialtestdata.list)
		.post(users.requiresLogin, officialtestdata.create);

	app.route('/officialtestdata/list/:userID')
		.get(officialtestdata.listByPatient);

	app.route('/officialtestdata/:officialtestdatumId')
		.get(officialtestdata.read)
		.post(users.requiresLogin, officialtestdata.update)
		.put(users.requiresLogin, officialtestdata.hasAuthorization, officialtestdata.update)
		.delete(users.requiresLogin, officialtestdata.hasAuthorization, officialtestdata.delete);

	// Finish by binding the Officialtestdatum middleware
	app.param('officialtestdatumId', officialtestdata.officialtestdatumByID);
	app.param('userID', users.userByID);
};
