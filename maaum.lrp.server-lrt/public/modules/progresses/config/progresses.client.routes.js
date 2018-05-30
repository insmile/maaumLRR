'use strict';

//Setting up route
angular.module('progresses').config(['$stateProvider',
	function($stateProvider) {
		// Progresses state routing
		$stateProvider.
		state('app.listProgresses', {
			url: '/progressTemplates',
			templateUrl: 'modules/progresses/views/list-progresses.client.view.html'
		}).
		state('app.createProgress', {
			url: '/progressTemplates/create',
			templateUrl: 'modules/progresses/views/create-progress.client.view.html'
		}).
		state('app.viewProgress', {
			url: '/progressTemplates/:progressId',
			templateUrl: 'modules/progresses/views/view-progress.client.view.html'
		}).
		state('app.editProgress', {
			url: '/progressTemplates/:progressId/edit',
			templateUrl: 'modules/progresses/views/edit-progress.client.view.html'
		});
	}
]);
