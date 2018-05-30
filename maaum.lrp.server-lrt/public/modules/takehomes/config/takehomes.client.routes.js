'use strict';

//Setting up route
angular.module('takehomes').config(['$stateProvider',
	function($stateProvider) {
		// Takehomes state routing
		$stateProvider.
		state('listTakehomes', {
			url: '/takehomes',
			templateUrl: 'modules/takehomes/views/list-takehomes.client.view.html'
		}).
		state('createTakehome', {
			url: '/takehomes/create',
			templateUrl: 'modules/takehomes/views/create-takehome.client.view.html'
		}).
		state('viewTakehome', {
			url: '/takehomes/:takehomeId',
			templateUrl: 'modules/takehomes/views/view-takehome.client.view.html'
		}).
		state('editTakehome', {
			url: '/takehomes/:takehomeId/edit',
			templateUrl: 'modules/takehomes/views/edit-takehome.client.view.html'
		});
	}
]);