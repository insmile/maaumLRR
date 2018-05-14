'use strict';

//Setting up route
angular.module('tasks').config(['$stateProvider', 'RouteHelpersProvider',
	function($stateProvider, helper) {
		// Tasks state routing
		$stateProvider.
		state('app.listTasks', {
			url: '/tasks',
			templateUrl: 'modules/tasks/views/list-tasks.client.view.html',
			resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
		}).
		state('app.createTask', {
			url: '/tasks/create',
			templateUrl: 'modules/tasks/views/create-task.client.view.html',
			resolve: helper.resolveFor('ngWig')
		}).
		state('app.viewTask', {
			url: '/tasks/:taskId',
			templateUrl: 'modules/tasks/views/view-task.client.view.html'
		}).
		state('app.editTask', {
			url: '/tasks/:taskId/edit',
			templateUrl: 'modules/tasks/views/edit-task.client.view.html'
		});
	}
]);
