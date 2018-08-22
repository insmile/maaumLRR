'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var problems = require('../../app/controllers/problems.server.controller');

	// Problems Routes
	app.route('/problems')
		.get(problems.list)
		.post(users.requiresLogin, problems.create);

	app.route('/problems/DT')
		.get(problems.DT);

/*	app.route('/problems/updatedb')
		.get(problems.updatedb);
		DB 스키마 변경에 따른 변화를 적용하기 위해 사용한 임시 코드*/

	app.route('/problems/:problemId')
		.get(problems.read)
		.put(users.requiresLogin, problems.hasAuthorization, problems.update)
		.delete(users.requiresLogin, problems.hasAuthorization, problems.delete);

	app.route('/problems/:problemId/:userID')
		.get(users.requiresLogin, users.expiredTest, problems.read);

	app.route('/problems/list')
		.post(users.requiresLogin, problems.listByTask);

	app.route('/problems/list/:userID')
		.post(users.requiresLogin, users.expiredTest, problems.listByTask);

	// Finish by binding the Problem middleware
	app.param('problemId', problems.problemByID);
	app.param('userID', users.userByID);
};
