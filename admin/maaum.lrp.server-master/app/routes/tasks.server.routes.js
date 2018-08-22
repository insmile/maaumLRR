'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tasks = require('../../app/controllers/tasks.server.controller');

	// Tasks Routes
	app.route('/tasks')
		.get(users.requiresLogin, tasks.list)
		.post(users.requiresLogin, tasks.create);

	app.route('/tasks/DT')
		.get(users.requiresLogin, tasks.DT);

	app.route('/tasks/category').get(users.requiresLogin, tasks.category);
	app.route('/tasks/name').get(users.requiresLogin, tasks.name);
	app.route('/tasks/list').get(users.requiresLogin, tasks.list_a);
	app.route('/tasks/info/:taskId').get(users.requiresLogin, tasks.info);

	app.route('/tasks/:taskId')
		.get(users.requiresLogin, tasks.read)
		.put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
		.delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);
	app.route('/tasks/:taskId/:userID')
		.get(users.requiresLogin, users.expiredTest, tasks.read);

	// Finish by binding the Task middleware
	app.param('taskId', tasks.taskByID);
	app.param('userID', users.userByID);
};
