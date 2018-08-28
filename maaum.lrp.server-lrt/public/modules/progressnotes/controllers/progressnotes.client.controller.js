'use strict';

// Progressnotes controller
angular.module('progressnotes').controller('ProgressnotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Progressnotes',
	function($scope, $stateParams, $location, Authentication, Progressnotes) {
		$scope.authentication = Authentication;

		// Create new Progressnote
		$scope.create = function() {
			// Create new Progressnote object
			var progressnote = new Progressnotes ({
				name: this.name
			});

			// Redirect after save
			progressnote.$save(function(response) {
				$location.path('progressnotes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Progressnote
		$scope.remove = function(progressnote) {
			if ( progressnote ) { 
				progressnote.$remove();

				for (var i in $scope.progressnotes) {
					if ($scope.progressnotes [i] === progressnote) {
						$scope.progressnotes.splice(i, 1);
					}
				}
			} else {
				$scope.progressnote.$remove(function() {
					$location.path('progressnotes');
				});
			}
		};

		// Update existing Progressnote
		$scope.update = function() {
			var progressnote = $scope.progressnote;

            progressnote.$update(function() {
                $location.path('progressnotes/' + progressnote._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};

		// Find a list of Progressnotes
		$scope.find = function() {
			$scope.progressnotes = Progressnotes.query();
		};

		// Find existing Progressnote
		$scope.findOne = function() {
			$scope.progressnote = Progressnotes.get({ 
				progressnoteId: $stateParams.progressnoteId
			});
		};
	}
]);
