'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var takehomes = require('../../app/controllers/takehomes.server.controller');

	// Takehomes Routes
	app.route('/takehomes')
		.get(takehomes.list)
		.post(users.requiresLogin, takehomes.create);

	app.route('/takehomes/list/:userId')
		.get(takehomes.listByPatient);


	app.route('/takehomes/:takehomeId')
		.get(takehomes.read)
		//.put(users.requiresLogin, takehomes.hasAuthorization, takehomes.update)
		.post(users.requiresLogin, takehomes.update)
		.delete(users.requiresLogin, takehomes.delete);

	// Finish by binding the Takehome middleware
	app.param('takehomeId', takehomes.takehomeByID);
	app.param('userId', users.userByID);
};
