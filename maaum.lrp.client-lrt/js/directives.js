// Code goes here

'use strict';

app.directive('myDirective', ['$window', function($window) {
    return {
        link: link,
        restrict: 'A'
    };

    function link(scope, element, attrs) {
        function onResize() {
            if (scope.pad !== undefined) {
                var aspectRatio = scope.aspectRatio;
                var cw = $window.innerWidth * scope.vw;
                var chw = $window.innerHeight * scope.vh / aspectRatio;
                scope.pad.resize(Math.min(cw, chw));
                console.log(aspectRatio);
                console.log(cw);
                console.log(chw);
            }
        };

        function cleanUp() {
            angular.element($window).off('resize', onResize);
        }

        angular.element($window).on('resize', onResize);
        scope.$on('$destroy', cleanUp);
    }
}]);