'use strict';

//Pay service used to communicate Centers REST endpoints
angular.module('pay').factory('Pay', ['$resource',
	function($resource) {
		return $resource('pay/:payId', { payId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
