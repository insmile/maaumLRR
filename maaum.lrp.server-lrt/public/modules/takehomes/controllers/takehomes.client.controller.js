'use strict';

// Takehomes controller
angular.module('takehomes').controller('TakehomesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Takehomes',
	function($scope, $stateParams, $location, Authentication, Takehomes) {
		$scope.authentication = Authentication;

		// Create new Takehome
		$scope.create = function() {
			// Create new Takehome object
			var takehome = new Takehomes ({
				name: this.name
			});

			// Redirect after save
			takehome.$save(function(response) {
				$location.path('takehomes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Takehome
		$scope.remove = function(takehome) {
			if ( takehome ) { 
				takehome.$remove();

				for (var i in $scope.takehomes) {
					if ($scope.takehomes [i] === takehome) {
						$scope.takehomes.splice(i, 1);
					}
				}
			} else {
				$scope.takehome.$remove(function() {
					$location.path('takehomes');
				});
			}
		};

		// Update existing Takehome
		$scope.update = function() {
			var takehome = $scope.takehome;

			takehome.$update(function() {
				$location.path('takehomes/' + takehome._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Takehomes
		$scope.find = function() {
			$scope.takehomes = Takehomes.query();
		};

		// Find existing Takehome
		$scope.findOne = function() {
			$scope.takehome = Takehomes.get({ 
				takehomeId: $stateParams.takehomeId
			});
		};
	}
]);