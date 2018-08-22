/**
 * Created by tm on 2015-05-15.
 */
angular.module('tasks').directive("taskInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: "modules/tasks/views/partial/taskInfo.html"
    }
});
