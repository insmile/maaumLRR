'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var officialtesttemplates = require('../../app/controllers/officialtesttemplates.server.controller');

	// Officialtesttemplates Routes
	app.route('/officialtesttemplates')
		.get(officialtesttemplates.list)
		.post(users.requiresLogin, officialtesttemplates.create);

	app.route('/officialtesttemplates/:officialtesttemplateId')
		.get(officialtesttemplates.read)
		.post(users.requiresLogin, officialtesttemplates.update)
		.put(users.requiresLogin, officialtesttemplates.hasAuthorization, officialtesttemplates.update)
		.delete(users.requiresLogin, officialtesttemplates.hasAuthorization, officialtesttemplates.delete);

	// Finish by binding the Officialtesttemplate middleware
	app.param('officialtesttemplateId', officialtesttemplates.officialtesttemplateByID);
};
