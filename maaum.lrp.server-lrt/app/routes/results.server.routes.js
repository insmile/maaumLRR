'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var results = require('../../app/controllers/results.server.controller');

	// Results Routes
	app.route('/results')
		.get(results.list)
		.post(users.requiresLogin, results.create);

	app.route('/results/list/:patientId')
		.get(results.listByPatient);

	app.route('/results/insert')
		.post(users.requiresLogin, results.create);

	app.route('/results/:resultId')
		.get(results.read)
		.put(users.requiresLogin, results.update)
		.post(users.requiresLogin, results.update)
		.delete(users.requiresLogin, results.delete);

	// Finish by binding the Result middleware
	app.param('resultId', results.resultByID);
	app.param('patientId', results.patientByID);
};
