/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

angular.module('core').config(['$stateProvider','$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES', 'RouteHelpersProvider',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appRequires, helper) {
  'use strict';

  angular.module('core').controller = $controllerProvider.register;
  angular.module('core').directive  = $compileProvider.directive;
  angular.module('core').filter     = $filterProvider.register;
  angular.module('core').factory    = $provide.factory;
  angular.module('core').service    = $provide.service;
  angular.module('core').constant   = $provide.constant;
  angular.module('core').value      = $provide.value;

  // LAZY MODULES
  // ----------------------------------- 

  $ocLazyLoadProvider.config({
    debug: true,
    events: true,
    modules: appRequires.modules
  });

  console.log($stateProvider);

  // default route
  $urlRouterProvider.otherwise('/home');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
      // url: '/',
      abstract: true,
      template: '<div data-ui-view autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>',
      resolve: helper.resolveFor('modernizr', 'icons')
      //resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
    })
    .state('app.home', {
      url: '/home',
      // abstract: true,
      // templateUrl: helper.basepath('app.html'),
      templateUrl: 'modules/core/views/home.client.view.html'
    })
    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;

}]);
