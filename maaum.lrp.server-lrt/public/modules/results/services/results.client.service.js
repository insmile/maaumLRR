'use strict';

//Results service used to communicate Results REST endpoints
angular.module('results').factory('Results', ['$resource',
	function($resource) {
		return $resource('results/:resultId', { resultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);