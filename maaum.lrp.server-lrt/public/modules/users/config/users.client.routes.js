'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', 'RouteHelpersProvider',
    function($stateProvider, helper) {

        var dtNoCenterTemplateUrls = {
            therapist: "modules/users/views/list/therapist.list.client.view.html",
            patient: "modules/users/views/list/patient.list.client.view.html",
        }
        var dtCenterTemplateUrls = {
            therapist: "modules/users/views/list/therapist.center.list.client.view.html",
            patient: "modules/users/views/list/patient.center.list.client.view.html",
        }
        var dtTemplateUrls = dtNoCenterTemplateUrls;
        if (ApplicationConfiguration.enableCenter) {
            dtTemplateUrls = dtCenterTemplateUrls;
        }
        console.log(dtTemplateUrls);

        // Users state routing
        $stateProvider.
        state('app.profile', {
            url: '/settings/profile',
            templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
        }).
        state('app.password', {
            url: '/settings/password',
            templateUrl: 'modules/users/views/settings/change-password.client.view.html'
        }).
        state('app.roles', {
            url: '/settings/roles/:userId',
            templateUrl: 'modules/users/views/settings/change-roles.client.view.html'
        }).
        state('app.accounts', {
            url: '/settings/accounts',
            templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
        }).
        state('app.signup-admin', {
            url: '/signup/admin',
            templateUrl: 'modules/users/views/authentication/signup.admin.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.signup-manager', {
            url: '/manager/add/:centerId',
            templateUrl: 'modules/users/views/authentication/signup.manager.client.view.html'
        }).
        state('app.signup-centermanager', {
            url: '/centermanager/signup',
            templateUrl: 'modules/users/views/authentication/signup.centermanager.client.view.html'
        }).
        state('app.signup-patient', {
            url: '/patient/signup',
            templateUrl: 'modules/users/views/authentication/signup.patient.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.signup-therapist', {
            url: '/therapist/signup',
            templateUrl: 'modules/users/views/authentication/signup.therapist.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.edit-therapist', {
            url: '/therapist/edit/:userId',
            templateUrl: 'modules/users/views/authentication/edit.therapist.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.edit-patient', {
            url: '/patient/edit/:userId',
            templateUrl: 'modules/users/views/authentication/edit.patient.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.edit-manager', {
            url: '/manager/edit/:userId',
            templateUrl: 'modules/users/views/authentication/edit.manager.client.view.html',
            resolve: helper.resolveFor('validation.match')
        }).
        state('app.password-therapist', {
            url: '/therapist/password/:userId',
            templateUrl: 'modules/users/views/settings/change-password-by-admin.client.view.html'
        }).
        state('app.password-patient', {
            url: '/patient/password/:userId',
            templateUrl: 'modules/users/views/settings/change-password-by-admin.client.view.html'
        }).
        state('app.password-manager', {
            url: '/manager/password/:userId',
            templateUrl: 'modules/users/views/settings/change-password-by-admin.client.view.html'
        }).
        state('app.list-user', {
            url: '/user/list',
            templateUrl: 'modules/users/views/list/user.list.client.view.html',
            resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
        }).
        state('app.list-therapist', {
            url: '/therapist/list',
            templateUrl: dtTemplateUrls['therapist'],
            resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
        }).
        state('app.list-patient', {
            url: '/patient/list',
            templateUrl: dtTemplateUrls['patient'],
            resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog')
        }).

        state('app.signin', {
            url: '/signin',
            templateUrl: 'modules/users/views/authentication/signin.client.view.html'
        }).
        state('app.forgot', {
            url: '/password/forgot',
            templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
        }).
        state('app.reset-invalid', {
            url: '/password/reset/invalid',
            templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
        }).
        state('app.reset-success', {
            url: '/password/reset/success',
            templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
        }).
        state('app.reset', {
            url: '/password/reset/:token',
            templateUrl: 'modules/users/views/password/reset-password.client.view.html'
        });
    }
]);