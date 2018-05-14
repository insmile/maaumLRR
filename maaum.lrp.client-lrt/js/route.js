var app = angular.module('LRProject', ['ionic', 'chart.js', 'ngCookies', 'angular-progress-arc', 'LRProject.controllers', 'LRProject.services']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

    .state('app.login', {
        cache: false,
        url: "/login",
        views: {
            'menuContent': {
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.list', {
        cache: false,
        url: "/list",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_List_Frame.html",
                controller: 'Ctrl_List'
            }
        }
    })

    .state('app.play', {
        cache: false,
        url: "/play",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_Exercise_Play.html",
                controller: 'Ctrl_PlayExercise'
            }
        }
    })

    .state('app.playOffline', {
        cache: false,
        url: "/playOffline",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_Exercise_PlayOffline.html",
                controller: 'Ctrl_PlayExerciseOffline'
            }
        }
    })

    .state('app.grading', {
        cache: false,
        url: "/grading",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_Exercise_Grading.html",
                controller: 'Ctrl_PlayGrading'
            }
        }
    })

    .state('app.gradingOffline', {
        cache: false,
        url: "/gradingOffline",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_Exercise_GradingOffline.html",
                controller: 'Ctrl_PlayGradingOffline'
            }
        }
    })

    .state('app.resultPage', {
        cache: false,
        url: "/resultPage",
        views: {
            'menuContent': {
                templateUrl: "templates/Page_Report.html",
                controller: 'Ctrl_Page_Report'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});