'use strict';

// Officialtesttemplates controller
angular.module('officialtesttemplates').controller('OfficialtesttemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Officialtesttemplates',
	function($scope, $stateParams, $location, Authentication, Officialtesttemplates) {
		$scope.authentication = Authentication;

		// Create new Officialtesttemplate
		$scope.create = function() {
			// Create new Officialtesttemplate object
			var officialtesttemplate = new Officialtesttemplates ({
				name: this.name
			});

			// Redirect after save
			officialtesttemplate.$save(function(response) {
				$location.path('officialtesttemplates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Officialtesttemplate
		$scope.remove = function(officialtesttemplate) {
			if ( officialtesttemplate ) { 
				officialtesttemplate.$remove();

				for (var i in $scope.officialtesttemplates) {
					if ($scope.officialtesttemplates [i] === officialtesttemplate) {
						$scope.officialtesttemplates.splice(i, 1);
					}
				}
			} else {
				$scope.officialtesttemplate.$remove(function() {
					$location.path('officialtesttemplates');
				});
			}
		};

		// Update existing Officialtesttemplate
		$scope.update = function() {
			var officialtesttemplate = $scope.officialtesttemplate;

			officialtesttemplate.$update(function() {
				$location.path('officialtesttemplates/' + officialtesttemplate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Officialtesttemplates
		$scope.find = function() {
			$scope.officialtesttemplates = Officialtesttemplates.query();
		};

		// Find existing Officialtesttemplate
		$scope.findOne = function() {
			$scope.officialtesttemplate = Officialtesttemplates.get({ 
				officialtesttemplateId: $stateParams.officialtesttemplateId
			});
		};
	}
]);