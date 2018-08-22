'use strict';

//Setting up route
angular.module('officialtestdata').config(['$stateProvider',
	function($stateProvider) {
		// Officialtestdata state routing
		$stateProvider.
		state('listOfficialtestdata', {
			url: '/officialtestdata',
			templateUrl: 'modules/officialtestdata/views/list-officialtestdata.client.view.html'
		}).
		state('createOfficialtestdatum', {
			url: '/officialtestdata/create',
			templateUrl: 'modules/officialtestdata/views/create-officialtestdatum.client.view.html'
		}).
		state('viewOfficialtestdatum', {
			url: '/officialtestdata/:officialtestdatumId',
			templateUrl: 'modules/officialtestdata/views/view-officialtestdatum.client.view.html'
		}).
		state('editOfficialtestdatum', {
			url: '/officialtestdata/:officialtestdatumId/edit',
			templateUrl: 'modules/officialtestdata/views/edit-officialtestdatum.client.view.html'
		});
	}
]);