'use strict';

//Progressnotes service used to communicate Progressnotes REST endpoints
angular.module('progressnotes').factory('Progressnotes', ['$resource',
	function($resource) {
		return $resource('progressnotes/:progressnoteId', { progressnoteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);