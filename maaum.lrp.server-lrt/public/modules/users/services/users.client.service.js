'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('users').factory('Centers', ['$resource',
    function($resource) {
        return $resource('centers/:centerId', { centerId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('users').factory('Therapists', ['$resource',
	function($resource) {
		return $resource('users/therapist/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('users').factory('Patients', ['$resource',
	function($resource) {
		return $resource('users/patient/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('users').factory('Managers', ['$resource',
    function($resource) {
        return $resource('users/manager/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
