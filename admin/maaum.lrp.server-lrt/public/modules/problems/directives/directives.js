/**
 * Created by tm on 2015-05-15.
 */
angular.module('problems').directive("defineInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/problems/views/partial/defineInfo.html"
    }
});

angular.module('problems').directive("problemInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/problems/views/partial/problemInfo.html"
    }
});
