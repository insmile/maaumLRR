'use strict';

//Setting up route
angular.module('problems').config(['$stateProvider', 'RouteHelpersProvider',
	function($stateProvider, helper) {
		// Problems state routing
		$stateProvider.
		state('app.listProblems', {
			url: '/problems',
			templateUrl: 'modules/problems/views/list-problems.client.view.html',
				resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
		}).
		state('app.createProblem', {
			url: '/problems/create',
			templateUrl: 'modules/problems/views/create-problem.client.view.html'
		}).
		state('app.viewProblem', {
			url: '/problems/:problemId',
			templateUrl: 'modules/problems/views/view-problem.client.view.html'
		}).
		state('app.editProblem', {
			url: '/problems/:problemId/edit',
			templateUrl: 'modules/problems/views/edit-problem.client.view.html'
		});
	}
]);
