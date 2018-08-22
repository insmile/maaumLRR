'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$stateParams',
	function($scope, $http, $location, Users, Authentication, $stateParams) {
		$scope.user = Authentication.user;

		if(user.roles === 'admin') {
            $scope.roles = [{text : "전체관리자", value : "admin"},
                {text : "기관관리자", value : "manager"},
                {text : "치료사", value : "therapist"},
                {text : "환자", value : "patient"}
			];
		}
		else if (user.roles === 'manager') {
            $scope.roles = [
                {text : "기관관리자", value : "manager"},
                {text : "치료사", value : "therapist"},
                {text : "환자", value : "patient"}
        	];
		}

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		$scope.changeUserRoles = function()
		{
            $scope.success = $scope.error = null;

            $http.post('/users/role/'+$stateParams.userId, $scope.userInfo).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
            }).error(function(response) {
                $scope.error = response.message;
            });
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.changeUserPasswordByAdmin = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password/'+$stateParams.userId, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
