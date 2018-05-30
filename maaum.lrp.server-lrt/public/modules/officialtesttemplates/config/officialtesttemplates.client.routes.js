'use strict';

//Setting up route
angular.module('officialtesttemplates').config(['$stateProvider',
	function($stateProvider) {
		// Officialtesttemplates state routing
		$stateProvider.
		state('app.listOfficialtesttemplates', {
			url: '/officialtesttemplates',
			templateUrl: 'modules/officialtesttemplates/views/list-officialtesttemplates.client.view.html'
		}).
		state('app.createOfficialtesttemplate', {
			url: '/officialtesttemplates/create',
			templateUrl: 'modules/officialtesttemplates/views/create-officialtesttemplate.client.view.html'
		}).
		state('app.viewOfficialtesttemplate', {
			url: '/officialtesttemplates/:officialtesttemplateId',
			templateUrl: 'modules/officialtesttemplates/views/view-officialtesttemplate.client.view.html'
		}).
		state('app.editOfficialtesttemplate', {
			url: '/officialtesttemplates/:officialtesttemplateId/edit',
			templateUrl: 'modules/officialtesttemplates/views/edit-officialtesttemplate.client.view.html'
		});
	}
]);
