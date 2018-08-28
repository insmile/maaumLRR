'use strict';
/**
 * Created by tm on 2015-05-15.
 */
angular.module('products').directive("productInfo", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: false,
        templateUrl: "modules/products/views/partial/product_info.html"
    }
});
