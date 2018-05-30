'use strict';

//Officialtestdata service used to communicate Officialtestdata REST endpoints
angular.module('officialtestdata').factory('Officialtestdata', ['$resource',
	function($resource) {
		return $resource('officialtestdata/:officialtestdatumId', { officialtestdatumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);