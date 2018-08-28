'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var progresses = require('../../app/controllers/progresses.server.controller');

	// Progresses Routes
	app.route('/progressTemplates')
		.get(progresses.list)
		.post(users.requiresLogin, progresses.create);
	app.route('/progressTemplates/list')
		.get(progresses.list);

    app.route('/progressTemplates/list/:userID')
        .get(progresses.listByUserID);

	app.route('/progressTemplates/insert')
		.post(users.requiresLogin, progresses.create);

    app.route('/progressTemplates/starred')
        .post(users.requiresLogin, progresses.starred);

    app.route('/progressTemplates/unstarred')
        .post(users.requiresLogin, progresses.unstarred);

	app.route('/progressTemplates/:progressTemplateID')
		.get(progresses.read)
		.put(users.requiresLogin, progresses.hasAuthorization, progresses.update)
		.post(users.requiresLogin, progresses.hasAuthorization, progresses.update)
		.delete(users.requiresLogin, progresses.hasAuthorization, progresses.delete);

	// Finish by binding the Progress middleware
	app.param('progressTemplateID', progresses.progressByID);
    app.param('userID', users.userByID);
};
