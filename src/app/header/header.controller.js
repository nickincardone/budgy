(function() {
  'use strict';

  angular.module('header').controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$rootScope', '$state', '$mdDialog', 'Event'];

  function HeaderController($rootScope, $state, $mdDialog, Event) {
    var ctrl = this;
    ctrl.$onInit = $onInit;
    ctrl.showStore = false;
    ctrl.goHome = goHome;

    function $onInit() {
      ctrl.showStore = $state.current.name !== 'login';
    }

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      //console.log(event.name + ': ' + toState.name);
      //console.log('rootScope.isSearchLoaded is ' + $scope.isSearchLoaded);
      ctrl.showStore = toState.name !== 'login';
    });

    ctrl.showModal = function(ev) {
      $mdDialog.show({
          controller: 'AddEventController',
          controllerAs: '$ctrl',
          templateUrl: 'home/add_event/add_event.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function(event) {
          Event.addEvent(event);
        }, function() {});
    };

    function goHome() {
      $state.go('home');
    }



  }
})();
