'use strict';

//Takehomes service used to communicate Takehomes REST endpoints
angular.module('takehomes').factory('Takehomes', ['$resource',
	function($resource) {
		return $resource('takehomes/:takehomeId', { takehomeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);