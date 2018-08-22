'use strict';

//Progresses service used to communicate Progresses REST endpoints
angular.module('progresses').factory('Progresses', ['$resource',
	function($resource) {
		return $resource('progressTemplates/:progressId', { progressId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
