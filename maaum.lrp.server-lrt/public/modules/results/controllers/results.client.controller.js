'use strict';

// Results controller
angular.module('results').controller('ResultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Results',
	function($scope, $stateParams, $location, Authentication, Results) {
		$scope.authentication = Authentication;

		// Create new Result
		$scope.create = function() {
			// Create new Result object
			var result = new Results ({
				name: this.name
			});

			// Redirect after save
			result.$save(function(response) {
				$location.path('results/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Result
		$scope.remove = function(result) {
			if ( result ) { 
				result.$remove();

				for (var i in $scope.results) {
					if ($scope.results [i] === result) {
						$scope.results.splice(i, 1);
					}
				}
			} else {
				$scope.result.$remove(function() {
					$location.path('results');
				});
			}
		};

		// Update existing Result
		$scope.update = function() {
			var result = $scope.result;

			result.$update(function() {
				$location.path('results/' + result._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Results
		$scope.find = function() {
			$scope.results = Results.query();
		};

		// Find existing Result
		$scope.findOne = function() {
			$scope.result = Results.get({ 
				resultId: $stateParams.resultId
			});
		};
	}
]);