'use strict';

// Officialtestdata controller
angular.module('officialtestdata').controller('OfficialtestdataController', ['$scope', '$stateParams', '$location', 'Authentication', 'Officialtestdata',
	function($scope, $stateParams, $location, Authentication, Officialtestdata) {
		$scope.authentication = Authentication;

		// Create new Officialtestdatum
		$scope.create = function() {
			// Create new Officialtestdatum object
			var officialtestdatum = new Officialtestdata ({
				name: this.name
			});

			// Redirect after save
			officialtestdatum.$save(function(response) {
				$location.path('officialtestdata/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Officialtestdatum
		$scope.remove = function(officialtestdatum) {
			if ( officialtestdatum ) { 
				officialtestdatum.$remove();

				for (var i in $scope.officialtestdata) {
					if ($scope.officialtestdata [i] === officialtestdatum) {
						$scope.officialtestdata.splice(i, 1);
					}
				}
			} else {
				$scope.officialtestdatum.$remove(function() {
					$location.path('officialtestdata');
				});
			}
		};

		// Update existing Officialtestdatum
		$scope.update = function() {
			var officialtestdatum = $scope.officialtestdatum;

			officialtestdatum.$update(function() {
				$location.path('officialtestdata/' + officialtestdatum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Officialtestdata
		$scope.find = function() {
			$scope.officialtestdata = Officialtestdata.query();
		};

		// Find existing Officialtestdatum
		$scope.findOne = function() {
			$scope.officialtestdatum = Officialtestdata.get({ 
				officialtestdatumId: $stateParams.officialtestdatumId
			});
		};
	}
]);