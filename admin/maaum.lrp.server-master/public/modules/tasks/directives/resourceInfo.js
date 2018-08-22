/**
 * Created by tm on 2015-05-15.
 */
angular.module('tasks').directive("resourceInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/tasks/views/partial/resourceInfo.html"
    }
});
