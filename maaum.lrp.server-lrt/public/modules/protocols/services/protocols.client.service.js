'use strict';

//Protocols service used to communicate Protocols REST endpoints
angular.module('protocols').factory('Protocols', ['$resource',
	function($resource) {
		return $resource('protocols/:protocolId', { protocolId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);