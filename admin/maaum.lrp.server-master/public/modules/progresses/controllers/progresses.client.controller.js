'use strict';

// Progresses controller
angular.module('progresses').controller('ProgressesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Progresses',
	function($scope, $stateParams, $location, Authentication, Progresses) {
		$scope.authentication = Authentication;

		// Create new Progress
		$scope.create = function() {
			// Create new Progress object
			var progress = new Progresses ({
				name: this.name,
				content: this.content
			});

			// Redirect after save
			progress.$save(function(response) {
				$location.path('progressTemplates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Progress
		$scope.remove = function(progress) {
			if ( progress ) { 
				progress.$remove();

				for (var i in $scope.progresses) {
					if ($scope.progresses [i] === progress) {
						$scope.progresses.splice(i, 1);
					}
				}
			} else {
				$scope.progress.$remove(function() {
					$location.path('progressTemplates');
				});
			}
		};

		// Update existing Progress
		$scope.update = function() {
			var progress = $scope.progress;

			progress.$update(function() {
				$location.path('progressTemplates/' + progress._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Progresses
		$scope.find = function() {
			$scope.progresses = Progresses.query();
		};

		// Find existing Progress
		$scope.findOne = function() {
			$scope.progress = Progresses.get({ 
				progressId: $stateParams.progressId
			});
		};
	}
]);
