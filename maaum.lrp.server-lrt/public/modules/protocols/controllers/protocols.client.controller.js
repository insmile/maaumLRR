'use strict';

// Protocols controller
angular.module('protocols').controller('ProtocolsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Protocols',
	function($scope, $stateParams, $location, Authentication, Protocols) {
		$scope.authentication = Authentication;

		// Create new Protocol
		$scope.create = function() {
			// Create new Protocol object
			var protocol = new Protocols ({
				name: this.name
			});

			// Redirect after save
			protocol.$save(function(response) {
				$location.path('protocols/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Protocol
		$scope.remove = function(protocol) {
			if ( protocol ) { 
				protocol.$remove();

				for (var i in $scope.protocols) {
					if ($scope.protocols [i] === protocol) {
						$scope.protocols.splice(i, 1);
					}
				}
			} else {
				$scope.protocol.$remove(function() {
					$location.path('protocols');
				});
			}
		};

		// Update existing Protocol
		$scope.update = function() {
			var protocol = $scope.protocol;

			protocol.$update(function() {
				$location.path('protocols/' + protocol._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Protocols
		$scope.find = function() {
			$scope.protocols = Protocols.query();
		};

		// Find existing Protocol
		$scope.findOne = function() {
			$scope.protocol = Protocols.get({ 
				protocolId: $stateParams.protocolId
			});
		};
	}
]);