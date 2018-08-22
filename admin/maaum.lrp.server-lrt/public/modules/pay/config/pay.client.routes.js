'use strict';

//Setting up route
angular.module('pay').config(['$stateProvider', 'RouteHelpersProvider',
    function($stateProvider, helper) {
        // Pays state routing
        $stateProvider.
        state('app.listPay', {
            url: '/pay/list',
            templateUrl: 'modules/pay/views/list-pay.client.view.html',
            resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
        }).
        state('app.createPay', {
            url: '/pay/create',
            templateUrl: 'modules/pay/views/create-pay.client.view.html'
        }).
        state('app.viewPay', {
            url: '/pay/:payId',
            templateUrl: 'modules/pay/views/view-pay.client.view.html'
        }).
        state('app.editPay', {
            url: '/pay/:payId/edit',
            templateUrl: 'modules/pay/views/edit-pay.client.view.html'
        });
    }
]);
