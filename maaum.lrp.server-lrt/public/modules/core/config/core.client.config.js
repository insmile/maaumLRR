'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
        function(Menus) {

            // Add default menu entry
            Menus.addMenuItem('sidebar', 'Home', 'home', null, '/home', true, null, null, 'icon-home');
            if (ApplicationConfiguration.enableCenter) {
                Menus.addMenuItem('sidebar', '상품 관리', 'products/list', 'dropdown', '/products(/.*)?', false, ['admin'], 1, 'icon-credit-card');
                Menus.addSubMenuItem('sidebar', 'products/list', '상품 목록', 'products/list', 'products/list', false, ['admin']);
                Menus.addSubMenuItem('sidebar', 'products/list', '상품 등록', 'products/create', 'products/create', false, ['admin']);
                Menus.addMenuItem('sidebar', '결재 관리', 'pay/list', 'dropdown', '/pay(/.*)?', false, ['admin', 'manager'], 2, 'fa fa-krw');
                Menus.addSubMenuItem('sidebar', 'pay/list', '결재 내역', 'pay/list', 'pay/list', false, ['admin', 'manager']);
                Menus.addSubMenuItem('sidebar', 'pay/list', '상품 추가', 'pay/create', 'pay/create', false, ['admin', 'manager']);
                Menus.addMenuItem('sidebar', '기관 관리', 'centers/list', 'dropdown', '/centers(/.*)?', false, ['admin'], 3, 'fa fa-building-o');
                Menus.addSubMenuItem('sidebar', 'centers/list', '기관 목록', 'centers/list', 'centers/list', false, ['admin']);
                Menus.addSubMenuItem('sidebar', 'centers/list', '기관 등록', 'centers/create', 'centers/create', false, ['admin']);
                Menus.addMenuItem('sidebar', '사용자 관리', 'user/list', 'dropdown', '/user(/.*)?', false, ['admin', 'manager'], 4, 'icon-user');
                Menus.addSubMenuItem('sidebar', 'user/list', '사용자 목록', 'user/list', 'user/list', false, ['admin', 'manager']);
            }
            Menus.addMenuItem('sidebar', '평가자 관리', 'therapist/list', 'dropdown', '/therapist(/.*)?', false, ['admin', 'manager'], 5, 'fa fa-user-md');
            Menus.addSubMenuItem('sidebar', 'therapist/list', '평가자 목록', 'therapist/list');
            Menus.addSubMenuItem('sidebar', 'therapist/list', '평가자 등록', 'therapist/signup');
            Menus.addMenuItem('sidebar', '환자 관리', 'patient/list', 'dropdown', '/patient(/.*)?', false, ['admin', 'manager', 'therapist'], 6, 'icon-users');
            Menus.addSubMenuItem('sidebar', 'patient/list', '환자 목록', 'patient/list');
            Menus.addSubMenuItem('sidebar', 'patient/list', '환자 등록', 'patient/signup');
            /*Menus.addMenuItem('sidebar', 'Articles', 'articles', 'dropdown', '/articles(/.*)?', false, null, 20);
            Menus.addSubMenuItem('sidebar', 'articles', 'List Articles', 'articles');
            Menus.addSubMenuItem('sidebar', 'articles', 'New Article', 'articles/create');*/
            Menus.addMenuItem('sidebar', '검사 관리', 'tasks', 'dropdown', '/tasks(/.*)?', false, ['admin', 'manager'], 7, 'icon-magnifier');
            Menus.addSubMenuItem('sidebar', 'tasks', '검사 목록', 'tasks');
            Menus.addSubMenuItem('sidebar', 'tasks', '검사 등록', 'tasks/create');
            Menus.addMenuItem('sidebar', '문제 관리', 'problems', 'dropdown', '/problems(/.*)?', false, ['admin', 'manager'], 8, 'icon-puzzle');
            Menus.addSubMenuItem('sidebar', 'problems', '문제 목록', 'problems');
            Menus.addSubMenuItem('sidebar', 'problems', '문제 등록', 'problems/create');
            Menus.addMenuItem('sidebar', '경과기록지 서식 관리', 'progressTemplates', 'dropdown', '/progressTemplates(/.*)?', false, ['admin', 'therapist'], 9, 'icon-puzzle');
            Menus.addSubMenuItem('sidebar', 'progressTemplates', '경과기록지 서식 목록', 'progressTemplates');
            Menus.addSubMenuItem('sidebar', 'progressTemplates', '경과기록지 서식 등록', 'progressTemplates/create');
            Menus.addMenuItem('sidebar', '공식검사명 관리', 'officialtesttemplates', 'dropdown', '/officialtesttemplates(/.*)?', false, ['admin', 'therapist'], 10, 'icon-puzzle');
            Menus.addSubMenuItem('sidebar', 'officialtesttemplates', '공식검사명 목록', 'officialtesttemplates');
            Menus.addSubMenuItem('sidebar', 'officialtesttemplates', '공식검사명 등록', 'officialtesttemplates/create');
        }
    ])
    .config(['$translateProvider', function($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'modules/core/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();

    }])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {

        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }]);