'use strict';

//Setting up route
angular.module('protocols').config(['$stateProvider',
	function($stateProvider) {
		// Protocols state routing
		$stateProvider.
		state('listProtocols', {
			url: '/protocols',
			templateUrl: 'modules/protocols/views/list-protocols.client.view.html'
		}).
		state('createProtocol', {
			url: '/protocols/create',
			templateUrl: 'modules/protocols/views/create-protocol.client.view.html'
		}).
		state('viewProtocol', {
			url: '/protocols/:protocolId',
			templateUrl: 'modules/protocols/views/view-protocol.client.view.html'
		}).
		state('editProtocol', {
			url: '/protocols/:protocolId/edit',
			templateUrl: 'modules/protocols/views/edit-protocol.client.view.html'
		});
	}
]);