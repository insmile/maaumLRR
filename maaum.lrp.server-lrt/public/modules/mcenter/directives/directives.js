/**
 * Created by tm on 2015-05-15.
 */
angular.module('centers').directive("centerInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/mcenter/views/partial/center_info.html"
    }
});
