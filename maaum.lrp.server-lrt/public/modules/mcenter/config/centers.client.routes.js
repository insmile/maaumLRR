'use strict';

//Setting up route
angular.module('centers').config(['$stateProvider', 'RouteHelpersProvider',
    function($stateProvider, helper) {
        // Centers state routing
        $stateProvider.
        state('app.listCenters', {
            url: '/centers/list',
            templateUrl: 'modules/mcenter/views/list-centers.client.view.html',
            resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
        }).
        state('app.createCenter', {
            url: '/centers/create',
            templateUrl: 'modules/mcenter/views/create-center.client.view.html'
        }).
        state('app.viewCenter', {
            url: '/centers/:centerId',
            templateUrl: 'modules/mcenter/views/view-center.client.view.html'
        }).
        state('app.editCenter', {
            url: '/centers/:centerId/edit',
            templateUrl: 'modules/mcenter/views/edit-center.client.view.html'
        });
    }
]);
