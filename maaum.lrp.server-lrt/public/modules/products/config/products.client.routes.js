'use strict';

//Setting up route
angular.module('products').config(['$stateProvider', 'RouteHelpersProvider',
	function($stateProvider, helper) {
		// Products state routing
		$stateProvider.
		state('app.listProducts', {
			url: '/products/list',
			templateUrl: 'modules/products/views/list-products.client.view.html',
				resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
		}).
		state('app.createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
        state('app.selectProduct', {
            url: '/products/select',
            templateUrl: 'modules/products/views/select-products.client.view.html',
				resolve: helper.resolveFor('dynamicLayout')
        }).
        state('app.viewProduct', {
            url: '/products/:productId',
            templateUrl: 'modules/products/views/view-product.client.view.html'
        }).
		state('app.editProduct', {
			url: '/products/:productId/edit',
			templateUrl: 'modules/products/views/edit-product.client.view.html'
		});
	}
]);
