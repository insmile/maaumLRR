/**
 * Created by tm on 2015-05-15.
 */
angular.module('pay').directive("payInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/pay/views/partial/pay_info.html"
    }
});
