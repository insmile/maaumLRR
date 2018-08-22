'use strict';

angular.module('users').controller('TherapistController', ['$scope', '$http', '$location', '$localStorage', 'Authentication', '$stateParams', 'Therapists',
    function($scope, $http, $location, $localStorage, Authentication, $stateParams, Therapists) {

        $scope.authentication = Authentication;

        $scope.title = "치료사 계정 정보 입력";

        var admin = $scope.authentication.user.roles === 'admin' || $scope.authentication.user.roles === 'manager';

        $scope.findOne = function() {
            $scope.title = "치료사 계정 정보 수정";
            if (!admin) return;
            $scope.credentials = Therapists.get({
                userId: $stateParams.userId
            });
            $scope.credentials.password = undefined;

            $scope.isUpdate = true;
        };

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = $scope.credentials;

                user.$update(function(response) {
                    $scope.success = true;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.signup = function() {
            $scope.credentials.roles = "therapist";

            if (admin === true)
                $scope.credentials.certified = true;

            if ($scope.credentials.password !== $scope.credentials.confirmPassword) {
                $scope.error = "비밀번호가 일치하지 않습니다.";
                alert($scope.error);
                return;
            }
            if ($scope.credentials.email !== $scope.credentials.confirmEmail) {
                $scope.error = "이메일 주소가 일치하지 않습니다.";
                alert($scope.error);
                return;
            }

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model

                if (admin === false)
                    $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/therapist/list');
            }).error(function(response) {
                console.log(response.message);
                $scope.error = response.message;
                alert(response.message);
            });
        };

        $scope.remove = function() {
            if (confirm('제거하시겠습니까?')) {
                $scope.credentials.$remove(function() {
                    $location.path('therapist/list');
                });
            }
        }
    }
]);

angular.module('users').controller('ManagerController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Centers', 'Managers',
    function($scope, $stateParams, $http, $location, Authentication, Centers, Managers) {

        $scope.authentication = Authentication;

        $scope.center = Centers.get({
            centerId: $stateParams.centerId
        });

        $scope.findOne = function() {
            $scope.title = "관리자 계정 정보 수정";
            $scope.credentials = Managers.get({
                userId: $stateParams.userId
            });

            //console.log($scope.credentials);

            $scope.credentials.password = undefined;

            $scope.isUpdate = true;
        };

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = $scope.credentials;

                user.$update(function(response) {
                    $scope.success = true;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.signup = function() {

            $scope.credentials.roles = "manager";
            $scope.credentials.center_name = $scope.center.name;
            $scope.credentials.center_id = $scope.center.center_id;
            $scope.credentials.center = $scope.center._id;

            if ($scope.credentials.password !== $scope.credentials.confirmPassword) {
                $scope.error = "비밀번호가 일치하지 않습니다.";
                alert($scope.error);
                return;
            }
            if ($scope.credentials.email !== $scope.credentials.confirmEmail) {
                $scope.error = "이메일 주소가 일치하지 않습니다.";
                alert($scope.error);
                return;
            }

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                //$scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/centers/list');
            }).error(function(response) {
                console.log(response.message);
                $scope.error = response.message;
                alert(response.message);
            });
        };
    }
]);

angular.module('users').controller('CenterManagerController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Centers', 'Managers', 'Users', 'Pay',
    function($scope, $stateParams, $http, $location, Authentication, Centers, Managers, Users, Pay) {


        $scope.signup = function() {

            //center_id
            //password
            //center_name
            //reg_id
            //address
            //tel
            //officer
            //officer_tel
            //email

            var f = $scope.f;

            var m = new Managers();
            var c = new Centers();
            var p = new Pay();

            m.username = f.center_id;
            m.password = f.password;
            m.email = f.email;
            m.name = f.officer;
            m.tel = f.tel;
            m.roles = 'manager';

            c.center_id = f.center_id;
            c.name = f.center_name;
            c.reg_id = f.reg_id;
            c.address = f.address;
            c.tel = f.tel;
            c.officer = f.officer;
            c.officer_tel = f.officer_tel;
            c.email = f.email;

            $http.post('/centers', c).success(function(res) {
                console.log(res);
                m.center = res._id;
                m.center_name = res.name;
                console.log(m);
                $http.post('/auth/signup', m).success(function(res) {
                    // And redirect to the index page
                    $location.path('/');
                }).error(function(err) {
                    console.log(err.message);
                    $scope.error = err.message;
                    alert(err.message);
                    c.$remove();
                });
            }).error(function(err) {
                console.log(err.message);
                $scope.error = err.message;
                alert(err.message);
            });
        };
    }
]);

angular.module('users').controller('AdminSignUpController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {

        $scope.authentication = Authentication;

        if ($scope.authentication.hasAdmin === true) {
            $location.path('/');
        }

        $scope.signup = function() {

            $scope.credentials.roles = "admin";

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                console.log(response.message);
                $scope.error = response.message;
                alert(response.message);
            });
        };
    }
]);

angular.module('users').controller('PatientController', ['$scope', '$http', '$location', 'Authentication', 'Patients', '$stateParams',
    function($scope, $http, $location, Authentication, Patients, $stateParams) {

        $scope.authentication = Authentication;

        var therapist = $scope.authentication.user.roles === 'therapist';
        var admin = $scope.authentication.user.roles === 'admin';
        var manager = $scope.authentication.user.roles === 'manager';
        $scope.title = "환자 계정 정보 입력";

        $scope.findOne = function() {
            $http.get('/therapist/list/').success(function(therapists) {
                $scope.therapists = therapists;
                $scope.title = "환자 계정 정보 수정";
                if (!(admin || therapist || manager)) return;
                $scope.credentials = Patients.get({
                    userId: $stateParams.userId
                });
                $scope.credentials.password = undefined;

                $scope.isUpdate = true;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;

                if ($scope.credentials.assignedTherapist !== undefined) {
                    console.log($scope.credentials.assignedTherapist);
                    if ($scope.credentials.assignedTherapist._id === "") {
                        delete $scope.credentials.assignedTherapist;
                        delete $scope.credentials.assignedTherapistName;
                    } else {
                        $scope.credentials.assignedTherapist = $scope.credentials.assignedTherapist._id;
                    }
                }

                var user = $scope.credentials;

                user.$update(function(response) {
                    $scope.success = true;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.signup = function(isValid) {

            if (isValid) {
                $scope.credentials.roles = "patient";

                if (therapist === true) {
                    $scope.credentials.assignedTherapist = $scope.authentication.user._id;
                }

                if ($scope.credentials.password !== $scope.credentials.confirmPassword) {
                    $scope.error = "비밀번호가 일치하지 않습니다.";
                    alert($scope.error);
                    return;
                }
                if ($scope.credentials.email !== $scope.credentials.confirmEmail) {
                    $scope.error = "이메일 주소가 일치하지 않습니다.";
                    alert($scope.error);
                    return;
                }

                $http.post('/auth/signup', $scope.credentials).success(function(response) {
                    // If successful we assign the response to the global user model

                    // And redirect to the index page
                    if (admin || therapist)
                        $location.path('/patient/list');
                    else
                        $location.path('/');
                }).error(function(response) {
                    console.log(response.message);
                    $scope.error = response.message;
                    alert(response.message);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function() {
            if (confirm('제거하시겠습니까?')) {
                $scope.credentials.$remove(function() {
                    $location.path('patient/list');
                });
            }
        }
    }
]);

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$localStorage', 'Authentication', '$upload', '$timeout',
    function($scope, $http, $location, $localStorage, Authentication, $upload, $timeout, ngDialog) {
        $scope.authentication = Authentication;

        $scope.fileReaderSupported = window.FileReader !== null;

        $scope.credentials = {};

        if (angular.isDefined($localStorage.username))
            $scope.credentials.username = $localStorage.username;

        if ($scope.authentication.user) $location.path('/');

        $scope.upload = function(files) {
            function extracted() {
                var file = files[i];
                $upload.upload({
                    url: '/uploads',
                    file: file
                }).success(function(data, status, headers, config) {
                    console.log('success');
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
                });
                return file;
            }

            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = extracted();
                }
            }
        };

        $scope.generateThumb = function(file) {
            console.log('generate Thumbs');
            if (file !== null) {
                console.log(file);
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        console.log('image');
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                file.dataUrl = e.target.result;
                                console.log(file);
                            });
                        };
                    });
                }
            }
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);