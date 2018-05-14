'use strict';

//Officialtesttemplates service used to communicate Officialtesttemplates REST endpoints
angular.module('officialtesttemplates').factory('Officialtesttemplates', ['$resource',
	function($resource) {
		return $resource('officialtesttemplates/:officialtesttemplateId', { officialtesttemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);