angular.module('LRProject.controllers.filter', [])
    .filter('highlight', function($sce) {
        return function(text, phrase) {
            if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="lrpSearchHighlighted">$1</span>');

            return $sce.trustAsHtml(text);
        }
    })
    .filter('sum', function() {
        return function(data) {
            if (angular.isUndefined(data))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v) {
                sum = sum + parseFloat(v);
            });
            return sum;
        }
    })
    .filter('sumOfValueFilter', function() {
        return function(data, key, id) {
            if (angular.isUndefined(data) || angular.isUndefined(key) || angular.isUndefined(id))
                return 0;

            var sum = 0;
            angular.forEach(data, function(v, k) {
                if (v !== null)
                    if (v["i"] === id)
                        sum = sum + (parseInt(v[key]));
            });
            return sum;
        }
    })
    .filter('sumOfValue', function() {
        return function(data, key) {
            if (angular.isUndefined(data) || angular.isUndefined(key))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v, k) {
                if (v !== null)
                    sum = sum + parseFloat(v[key]);
            });
            return sum;
        }
    }).filter('totalSumPriceQty', function() {
        return function(data, key1, key2) {
            if (angular.isUndefined(data) || angular.isUndefined(key1) || angular.isUndefined(key2))
                return 0;

            var sum = 0;
            angular.forEach(data, function(v, k) {
                sum = sum + (parseInt(v[key1]) * parseInt(v[key2]));
            });
            return sum;
        }
    });