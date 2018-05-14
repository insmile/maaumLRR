'use strict';

angular.module('core').controller('SidebarController',
  ['$rootScope', '$scope', '$state', 'APP_MEDIAQUERY', 'Authentication', 'Menus',
  function($rootScope, $scope, $state, mq, Authentication, Menus){

    $scope.authentication = Authentication;
    $scope.menu = Menus.getMenu('sidebar');

    var currentState = $rootScope.$state.current.name;
    var $win = $(window);
    var $html = $('html');
    var $body = $('body');

    // Adjustment on route changes
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      currentState = toState;
      // Hide sidebar automatically on mobile
      $('body.aside-toggled').removeClass('aside-toggled');

      $rootScope.$broadcast('closeSidebarMenu');
    });

    // Normalize state on resize to avoid multiple checks
    $win.on('resize', function() {
      if( isMobile() )
        $body.removeClass('aside-collapsed');
      else
        $body.removeClass('aside-toggled');
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      var foundActive = false;
      angular.forEach(item.items, function(subitem, key) {
        if( currentState.url === subitem.uiRoute ) {
          foundActive = true;
          return false;
        }
      });
      return foundActive;

    };

    // Load menu from json file
    // ----------------------------------- 
    
    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
             (isActive(item) ? ' active' : '') ;
    };

    // Handle sidebar collapse items
    // ----------------------------------- 
    var collapseList = [];

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {


      // collapsed sidebar doesn't toggle drodopwn
      if( isSidebarCollapsed() && !isMobile() ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        collapseList[$index] = !collapseList[$index];
        closeAllBut($index);
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }
    
      return true;
    
    };

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
      // angular.forEach(collapseList, function(v, i) {
      // });
    }

    // Helper checks
    // ----------------------------------- 

    function isMobile() {
      return $win.width() < mq.tablet;
    }
    function isTouch() {
      return $html.hasClass('touch');
    }
    function isSidebarCollapsed() {
      return $body.hasClass('aside-collapsed');
    }
    function isSidebarToggled() {
      return $body.hasClass('aside-toggled');
    }

  }
]);
