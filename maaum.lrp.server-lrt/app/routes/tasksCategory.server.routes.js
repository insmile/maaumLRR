'use strict';


module.exports = function(app) {

	var taskCategory = require('../../app/controllers/tasksCategory.server.controller');

	app.route('/category')
		.get(  taskCategory.readList)
		.post(  taskCategory.create);
		// .put(users.requiresLogin, taskCategory.update);
		// .put(  taskCategory.update);
	
	//////
	app.route('/category/:categoryId')
		.get(  taskCategory.test123)
		.post(  taskCategory.test124);
		
		
	app.route('/category/read/:categoryId')
		.get(taskCategory.read2) // 현재 이거 탐.
		.post(taskCategory.readTest2);
	
		
	app.route('/category/update/:categoryId')
		.get(taskCategory.update)
		;


	app.param('categoryId', taskCategory.categoryByID);

	
};
