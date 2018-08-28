'use strict';

//Setting up route
angular.module('progressnotes').config(['$stateProvider',
	function($stateProvider) {
		// Progressnotes state routing
		$stateProvider.
		state('app.listProgressnotes', {
			url: '/progressnotes',
			templateUrl: 'modules/progressnotes/views/list-progressnotes.client.view.html'
		}).
		state('app.createProgressnote', {
			url: '/progressnotes/create',
			templateUrl: 'modules/progressnotes/views/create-progressnote.client.view.html'
		}).
		state('app.viewProgressnote', {
			url: '/progressnotes/:progressnoteId',
			templateUrl: 'modules/progressnotes/views/view-progressnote.client.view.html'
		}).
		state('app.editProgressnote', {
			url: '/progressnotes/:progressnoteId/edit',
			templateUrl: 'modules/progressnotes/views/edit-progressnote.client.view.html'
		});
	}
]);
