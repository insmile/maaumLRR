/**
 * Created by tm on 2015-05-15.
 */
angular.module('users').directive("idInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/idinfo.html"
    }
});
angular.module('users').directive("pwInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/pwinfo.html"
    }
});
angular.module('users').directive("defaultInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/defaultinfo.html"
    }
});
angular.module('users').directive("modifyInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/modifyinfo.html"
    }
});
angular.module('users').directive("signinInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/signininfo.html"
    }
});
angular.module('users').directive("patientInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/patientinfo.html"
    }
});
angular.module('users').directive("therapistInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/users/views/authentication/partial/therapistinfo.html"
    }
});
